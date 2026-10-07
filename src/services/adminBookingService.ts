import { getSupabaseAdminClient, getSupabaseServerClient } from '@/lib/supabase/server';

export interface AdminBooking {
  id: string;
  booking_reference: string;
  service: string;
  package_name: string;
  price: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  property_address: string;
  bedrooms: number;
  bathrooms: number;
  notes?: string;
  booking_date: string;
  booking_time: string;
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded';
  booking_status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  created_at: string;
  updated_at?: string;
}

export interface BookingFilters {
  search?: string;
  payment_status?: string;
  booking_status?: string;
  service?: string;
  date_from?: string;
  date_to?: string;
  sort_by?: 'booking_date' | 'created_at' | 'price';
  sort_order?: 'asc' | 'desc';
  page?: number;
  page_size?: number;
}

export interface BookingKPIs {
  totalBookings: number;
  pendingBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  totalRevenue: number;
  paidTransactions: number;
  pendingTransactions: number;
  failedTransactions: number;
  serviceBreakdown: Record<string, number>;
}

export interface GetBookingsResult {
  bookings: AdminBooking[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  error?: string | null;
}

/**
 * Returns the best available server Supabase client for admin operations.
 * Prefers admin client (service role) to bypass RLS, falls back to server client.
 */
function getClient() {
  const adminClient = getSupabaseAdminClient();
  if (adminClient) return adminClient;
  return getSupabaseServerClient();
}

/**
 * Ensures database queries fail gracefully and fast if remote cloud host is unreachable.
 */
function withTimeout<T>(promise: PromiseLike<T>, ms: number = 3000): Promise<T> {
  return Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error('Database connection timed out')), ms)
    ),
  ]);
}

/**
 * Normalizes raw database records into standard typed AdminBooking models.
 */
function normalizeBooking(row: Record<string, unknown>): AdminBooking {
  return {
    id: String(row.id || ''),
    booking_reference: String(row.booking_reference || ''),
    service: String(row.service || ''),
    package_name: String(row.package_name || ''),
    price: typeof row.price === 'number' ? row.price : parseFloat(String(row.price || 0)) || 0,
    first_name: String(row.first_name || ''),
    last_name: String(row.last_name || ''),
    email: String(row.email || ''),
    phone: String(row.phone || ''),
    property_address: String(row.property_address || ''),
    bedrooms: typeof row.bedrooms === 'number' ? row.bedrooms : parseInt(String(row.bedrooms || 0), 10) || 0,
    bathrooms: typeof row.bathrooms === 'number' ? row.bathrooms : parseFloat(String(row.bathrooms || 0)) || 0,
    notes: row.notes ? String(row.notes) : '',
    booking_date: String(row.booking_date || ''),
    booking_time: String(row.booking_time || ''),
    payment_status: (String(row.payment_status || 'pending').toLowerCase() as AdminBooking['payment_status']),
    booking_status: (String(row.booking_status || 'pending').toLowerCase() as AdminBooking['booking_status']),
    created_at: String(row.created_at || new Date().toISOString()),
    updated_at: row.updated_at ? String(row.updated_at) : undefined,
  };
}

/**
 * Fetch bookings with optional search, filters, pagination, and sorting.
 */
export async function getBookings(filters: BookingFilters = {}): Promise<GetBookingsResult> {
  const page = Math.max(1, filters.page || 1);
  const pageSize = Math.max(1, filters.page_size || 15);
  const offset = (page - 1) * pageSize;

  try {
    const supabase = getClient();
    let query = supabase.from('bookings').select('*', { count: 'exact' });

    // Apply Status Filters
    if (filters.payment_status && filters.payment_status !== 'all') {
      query = query.eq('payment_status', filters.payment_status);
    }
    if (filters.booking_status && filters.booking_status !== 'all') {
      query = query.eq('booking_status', filters.booking_status);
    }
    if (filters.service && filters.service !== 'all') {
      query = query.ilike('service', `%${filters.service}%`);
    }

    // Apply Date Range
    if (filters.date_from) {
      query = query.gte('booking_date', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('booking_date', filters.date_to);
    }

    // Apply Text Search (matches reference, customer name, email, phone, or address)
    if (filters.search && filters.search.trim()) {
      const term = filters.search.trim();
      query = query.or(
        `booking_reference.ilike.%${term}%,first_name.ilike.%${term}%,last_name.ilike.%${term}%,email.ilike.%${term}%,phone.ilike.%${term}%,property_address.ilike.%${term}%`
      );
    }

    // Apply Sorting
    const sortBy = filters.sort_by || 'created_at';
    const sortOrder = filters.sort_order || 'desc';
    query = query.order(sortBy, { ascending: sortOrder === 'asc' });

    // Pagination
    query = query.range(offset, offset + pageSize - 1);

    const { data, count, error } = await withTimeout(query);

    if (error) {
      console.error('[adminBookingService.getBookings] Supabase error:', error.message);
      return {
        bookings: [],
        total: 0,
        page,
        pageSize,
        totalPages: 0,
        error: error.message,
      };
    }

    const bookings = (data || []).map(normalizeBooking);
    const total = count || bookings.length;

    return {
      bookings,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize) || 1,
      error: null,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[adminBookingService.getBookings] Exception:', msg);
    return {
      bookings: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0,
      error: msg,
    };
  }
}

/**
 * Fetch a single booking by reference or ID.
 */
export async function getBookingByReference(reference: string): Promise<{ booking: AdminBooking | null; error: string | null }> {
  try {
    const supabase = getClient();
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .eq('booking_reference', reference)
      .maybeSingle();

    if (error) {
      return { booking: null, error: error.message };
    }
    return { booking: data ? normalizeBooking(data) : null, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { booking: null, error: msg };
  }
}

/**
 * Update a booking's status (pending, confirmed, completed, cancelled).
 */
export async function updateBookingStatus(
  id: string,
  newStatus: AdminBooking['booking_status']
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getClient();
    const { error } = await supabase
      .from('bookings')
      .update({
        booking_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Update a booking's payment status (pending, paid, failed, refunded).
 */
export async function updatePaymentStatus(
  id: string,
  newStatus: AdminBooking['payment_status']
): Promise<{ success: boolean; error: string | null }> {
  try {
    const supabase = getClient();
    const { error } = await supabase
      .from('bookings')
      .update({
        payment_status: newStatus,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id);

    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { success: false, error: msg };
  }
}

/**
 * Aggregate top-level KPIs from real Supabase booking records.
 * Returns exact metrics, or zero counts with error information if DB is unreachable.
 */
export async function getDashboardKPIs(): Promise<{ stats: BookingKPIs; error: string | null }> {
  const emptyStats: BookingKPIs = {
    totalBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedBookings: 0,
    cancelledBookings: 0,
    totalRevenue: 0,
    paidTransactions: 0,
    pendingTransactions: 0,
    failedTransactions: 0,
    serviceBreakdown: {},
  };

  try {
    const supabase = getClient();
    const { data, error } = await withTimeout(
      supabase.from('bookings').select('price, payment_status, booking_status, service')
    );

    if (error) {
      console.error('[adminBookingService.getDashboardKPIs] Supabase error:', error.message);
      return { stats: emptyStats, error: error.message };
    }

    if (!data || data.length === 0) {
      return { stats: emptyStats, error: null };
    }

    const stats: BookingKPIs = {
      totalBookings: data.length,
      pendingBookings: 0,
      confirmedBookings: 0,
      completedBookings: 0,
      cancelledBookings: 0,
      totalRevenue: 0,
      paidTransactions: 0,
      pendingTransactions: 0,
      failedTransactions: 0,
      serviceBreakdown: {},
    };

    for (const row of data) {
      const bStatus = String(row.booking_status || '').toLowerCase();
      const pStatus = String(row.payment_status || '').toLowerCase();
      const price = typeof row.price === 'number' ? row.price : parseFloat(String(row.price || 0)) || 0;
      const service = String(row.service || 'Other').trim();

      // Booking Status count
      if (bStatus === 'pending') stats.pendingBookings++;
      else if (bStatus === 'confirmed') stats.confirmedBookings++;
      else if (bStatus === 'completed') stats.completedBookings++;
      else if (bStatus === 'cancelled') stats.cancelledBookings++;

      // Payment Status count & revenue
      if (pStatus === 'paid') {
        stats.paidTransactions++;
        stats.totalRevenue += price;
      } else if (pStatus === 'pending') {
        stats.pendingTransactions++;
      } else if (pStatus === 'failed') {
        stats.failedTransactions++;
      }

      // Service breakdown
      stats.serviceBreakdown[service] = (stats.serviceBreakdown[service] || 0) + 1;
    }

    return { stats, error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[adminBookingService.getDashboardKPIs] Exception:', msg);
    return { stats: emptyStats, error: msg };
  }
}

/**
 * Fetch recent bookings for the dashboard overview.
 */
export async function getRecentBookings(limit: number = 8): Promise<{ bookings: AdminBooking[]; error: string | null }> {
  try {
    const supabase = getClient();
    const { data, error } = await withTimeout(
      supabase.from('bookings').select('*').order('created_at', { ascending: false }).limit(limit)
    );

    if (error) {
      return { bookings: [], error: error.message };
    }
    return { bookings: (data || []).map(normalizeBooking), error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { bookings: [], error: msg };
  }
}

/**
 * Fetch all matching bookings for CSV export without pagination limit.
 */
export async function getExportBookings(filters: BookingFilters = {}): Promise<{ bookings: AdminBooking[]; error: string | null }> {
  try {
    const supabase = getClient();
    let query = supabase.from('bookings').select('*');

    if (filters.payment_status && filters.payment_status !== 'all') {
      query = query.eq('payment_status', filters.payment_status);
    }
    if (filters.booking_status && filters.booking_status !== 'all') {
      query = query.eq('booking_status', filters.booking_status);
    }
    if (filters.service && filters.service !== 'all') {
      query = query.ilike('service', `%${filters.service}%`);
    }
    if (filters.date_from) {
      query = query.gte('booking_date', filters.date_from);
    }
    if (filters.date_to) {
      query = query.lte('booking_date', filters.date_to);
    }

    query = query.order('booking_date', { ascending: false });

    const { data, error } = await withTimeout(query);
    if (error) {
      return { bookings: [], error: error.message };
    }
    return { bookings: (data || []).map(normalizeBooking), error: null };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    return { bookings: [], error: msg };
  }
}
