'use client';

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import BookingProgress from "./BookingProgress";
import Step1ServiceSelection from "./Step1ServiceSelection";
import Step2PackageSelection from "./Step2PackageSelection";
import Step3PropertyDetails from "./Step3PropertyDetails";
import Step4DateTimeSelection from "./Step4DateTimeSelection";
import Step5CustomerDetails from "./Step5CustomerDetails";
import BookingSummary from "./BookingSummary";
import PaymentModal from "./PaymentModal";

import {
  AVAILABLE_SERVICES,
  getPackagesForService,
  getMappedPropertyType,
  calculatePackagePrice,
} from "@/lib/data/bookingData";

import type {
  BookingService,
  BookingPackage,
  PropertyDetails,
  ScheduleDetails,
  CustomerDetails,
  BookingData,
  StoreyType,
} from "@/lib/types/booking";

export default function BookingFlow() {
  const searchParams = useSearchParams();
  const services = AVAILABLE_SERVICES;

  const serviceParam = searchParams.get("service");
  const packageParam = searchParams.get("package");
  const bedroomsParam = searchParams.get("bedrooms");
  const bathroomsParam = searchParams.get("bathrooms");
  const storeyParam = searchParams.get("storey");
  const cleanersParam = searchParams.get("cleaners");

  const initialHasParams = Boolean(serviceParam || packageParam || bedroomsParam);

  // 1. Resolve initial service
  const [selectedService, setSelectedService] = useState<BookingService>(() => {
    if (serviceParam) {
      const found = services.find((s) => s.id === serviceParam);
      if (found) return found;
    }
    return services[0];
  });

  // 2. Resolve packages for the initial service
  const servicePackages = getPackagesForService(selectedService.id);

  // 3. Resolve initial package
  const [selectedPackage, setSelectedPackage] = useState<BookingPackage>(() => {
    if (packageParam) {
      const found = servicePackages.find(
        (p) =>
          p.id === packageParam ||
          p.name.toLowerCase().includes(packageParam.toLowerCase())
      );
      if (found) return found;
    }
    return servicePackages[0];
  });

  // 4. Resolve property state with pre-populated params
  const [property, setProperty] = useState<PropertyDetails>(() => ({
    address: "",
    bedrooms: bedroomsParam || "1",
    bathrooms: bathroomsParam || "1",
    storey: (storeyParam as StoreyType) || "Single",
    cleanersCount: cleanersParam ? parseInt(cleanersParam, 10) : 1,
    notes: "",
  }));

  // State Management
  const [currentStep, setCurrentStep] = useState<number>(initialHasParams ? 3 : 1);
  const [completedSteps, setCompletedSteps] = useState<number[]>(initialHasParams ? [1, 2] : []);

  const [schedule, setSchedule] = useState<ScheduleDetails>({
    date: "",
    time: "10:00 AM - 12:00 PM",
  });

  const [customer, setCustomer] = useState<CustomerDetails>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialInstructions: "",
  });

  // Errors & Modal
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [preparedBookingData, setPreparedBookingData] = useState<BookingData | null>(null);

  // Handle service selection change
  const handleSelectService = (service: BookingService) => {
    setSelectedService(service);
    const newPackages = getPackagesForService(service.id);
    setSelectedPackage(newPackages[0]);
  };

  // Current packages available for selected service
  const currentPackages = getPackagesForService(selectedService.id);

  // Derived mapped property type & current price
  const mappedPropertyType = getMappedPropertyType(property.bedrooms);
  const calculatedPrice = calculatePackagePrice(
    selectedPackage,
    mappedPropertyType,
    property.storey,
    property.cleanersCount || 1
  );

  // Step Navigation Handlers
  const handleStepClick = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  const markStepCompleted = (stepNumber: number) => {
    if (!completedSteps.includes(stepNumber)) {
      setCompletedSteps((prev) => [...prev, stepNumber]);
    }
  };

  const handleNextStep = () => {
    // Step-specific validation
    if (currentStep === 3) {
      if (!property.address.trim()) {
        setErrors({ address: "Please enter your property address." });
        return;
      }
      setErrors({});
    }

    if (currentStep === 4) {
      const stepErrors: Record<string, string> = {};
      if (!schedule.date) stepErrors.date = "Please select a cleaning date.";
      if (!schedule.time) stepErrors.time = "Please select a preferred arrival time.";
      if (Object.keys(stepErrors).length > 0) {
        setErrors(stepErrors);
        return;
      }
      setErrors({});
    }

    markStepCompleted(currentStep);
    setCurrentStep((prev) => Math.min(prev + 1, 5));
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  const handleBackStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    window.scrollTo({ top: 200, behavior: "smooth" });
  };

  // Payment Abstraction Handler
  const handleContinueToPayment = () => {
    const customerErrors: Record<string, string> = {};
    if (!customer.firstName.trim()) customerErrors.firstName = "First name is required.";
    if (!customer.lastName.trim()) customerErrors.lastName = "Last name is required.";
    
    if (!customer.email.trim()) {
      customerErrors.email = "Email address is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email)) {
      customerErrors.email = "Please enter a valid email address.";
    }

    if (!customer.phone.trim()) {
      customerErrors.phone = "Phone number is required.";
    } else if (customer.phone.trim().length < 8) {
      customerErrors.phone = "Please enter a valid phone number.";
    }

    if (Object.keys(customerErrors).length > 0) {
      setErrors(customerErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Prepare clean structured booking data payload
    const refId = `HC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

    const bookingPayload: BookingData = {
      bookingReference: refId,
      createdAt: new Date().toISOString(),
      service: {
        id: selectedService.id,
        name: selectedService.name,
      },
      package: {
        id: selectedPackage.id,
        name: selectedPackage.name,
        price: calculatedPrice,
        propertyTypeMapped: selectedService.id === "airbnb-cleaning" ? mappedPropertyType : undefined,
      },
      property,
      schedule,
      customer,
      bookingStatus: "pending",
      paymentStatus: "pending",
    };

    setTimeout(() => {
      setIsSubmitting(false);
      markStepCompleted(5);
      setPreparedBookingData(bookingPayload);
      setModalOpen(true);
    }, 400);
  };

  return (
    <section className="w-full bg-[#EBF6FB]/40 py-12 lg:py-16">
      {/* Visual Step Progress Bar */}
      <BookingProgress
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <div className="max-w-[1200px] mx-auto px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Step Area */}
          <div className="lg:col-span-8">
            {currentStep === 1 && (
              <Step1ServiceSelection
                services={services}
                selectedServiceId={selectedService.id}
                onSelectService={handleSelectService}
                onNext={handleNextStep}
              />
            )}

            {currentStep === 2 && (
              <Step2PackageSelection
                packages={currentPackages}
                selectedPackageId={selectedPackage.id}
                mappedPropertyType={mappedPropertyType}
                storey={property.storey}
                onSelectPackage={setSelectedPackage}
                onNext={handleNextStep}
                onBack={handleBackStep}
              />
            )}

            {currentStep === 3 && (
              <Step3PropertyDetails
                property={property}
                onChange={setProperty}
                onNext={handleNextStep}
                onBack={handleBackStep}
                errors={errors}
              />
            )}

            {currentStep === 4 && (
              <Step4DateTimeSelection
                schedule={schedule}
                onChange={setSchedule}
                onNext={handleNextStep}
                onBack={handleBackStep}
                errors={errors}
              />
            )}

            {currentStep === 5 && (
              <Step5CustomerDetails
                customer={customer}
                onChange={setCustomer}
                onSubmit={handleContinueToPayment}
                onBack={handleBackStep}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            )}
          </div>

          {/* Sticky Dynamic Booking Summary Sidebar */}
          <div className="lg:col-span-4">
            <BookingSummary
              service={selectedService}
              selectedPackage={selectedPackage}
              calculatedPrice={calculatedPrice}
              property={property}
              schedule={schedule}
              customer={customer}
              currentStep={currentStep}
            />
          </div>

        </div>
      </div>

      {/* Payment Gateway Ready Confirmation Modal */}
      {preparedBookingData && (
        <PaymentModal
          bookingData={preparedBookingData}
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
        />
      )}
    </section>
  );
}
