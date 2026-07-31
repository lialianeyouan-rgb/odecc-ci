import React, { useState } from "react";
import { contactService } from "@/services/contactService";
import Toast, { ToastType } from "@/components/Toast";

const SUBJECT_OPTIONS = [
  { value: "", label: "Choisir un sujet" },
  { value: "demande_acces", label: "Demande d'accès" },
  { value: "faire_don", label: "Faire un don" },
  { value: "partenariat", label: "Partenariat" },
  { value: "autre", label: "Autre" },
] as const;

type FormData = {
  lastName: string;
  firstName: string;
  address: string;
  phone: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormData: FormData = {
  lastName: "",
  firstName: "",
  address: "",
  phone: "",
  email: "",
  subject: "",
  message: "",
};

const ContactForm: React.FC = () => {
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus("submitting");

    try {
      await contactService.sendMessage({
        lastName: formData.lastName.trim(),
        firstName: formData.firstName.trim(),
        address: formData.address.trim(),
        phone: formData.phone.trim(),
        email: formData.email.trim(),
        subject: formData.subject,
        message: formData.message.trim(),
      });

      setStatus("success");
      setFormData(initialFormData);
      setToast({ message: "Message envoyé avec succès. Nous vous recontacterons rapidement.", type: "success" });
      setTimeout(() => setStatus("idle"), 500);
    } catch (err) {
      setStatus("error");
      const message = err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.";
      setToast({ message, type: "error" });
      setTimeout(() => setStatus("idle"), 500);
    }
  };

  const isLoading = status === "submitting";

  const inputBase =
    "w-full px-4 py-3 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 " +
    "focus:ring-2 focus:ring-odec-gold-500 focus:border-odec-gold-500 outline-none transition font-sans";

  const labelClass = "block text-sm font-semibold text-odec-blue-900 mb-2 font-montserrat";

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="lastName" className={labelClass}>
              Nom <span className="text-red-500">*</span>
            </label>
            <input
              id="lastName"
              type="text"
              name="lastName"
              placeholder="Votre nom"
              value={formData.lastName}
              onChange={handleChange}
              required
              className={inputBase}
              autoComplete="family-name"
            />
          </div>
          <div>
            <label htmlFor="firstName" className={labelClass}>
              Prénom <span className="text-red-500">*</span>
            </label>
            <input
              id="firstName"
              type="text"
              name="firstName"
              placeholder="Votre prénom"
              value={formData.firstName}
              onChange={handleChange}
              required
              className={inputBase}
              autoComplete="given-name"
            />
          </div>
        </div>

        <div>
          <label htmlFor="address" className={labelClass}>
            Adresse <span className="text-red-500">*</span>
          </label>
          <input
            id="address"
            type="text"
            name="address"
            placeholder="Adresse postale"
            value={formData.address}
            onChange={handleChange}
            required
            className={inputBase}
            autoComplete="street-address"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div>
            <label htmlFor="phone" className={labelClass}>
              Numéro de téléphone <span className="text-red-500">*</span>
            </label>
            <input
              id="phone"
              type="tel"
              name="phone"
              placeholder="Ex. +225 07 00 00 00 00"
              value={formData.phone}
              onChange={handleChange}
              required
              className={inputBase}
              autoComplete="tel"
            />
          </div>
          <div>
            <label htmlFor="email" className={labelClass}>
              Email <span className="text-red-500">*</span>
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="votre@email.com"
              value={formData.email}
              onChange={handleChange}
              required
              className={inputBase}
              autoComplete="email"
            />
          </div>
        </div>

        <div>
          <label htmlFor="subject" className={labelClass}>
            Sujet <span className="text-red-500">*</span>
          </label>
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className={inputBase + " cursor-pointer appearance-none bg-white"}
          >
            {SUBJECT_OPTIONS.map((opt) => (
              <option key={opt.value || "empty"} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="message" className={labelClass}>
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            rows={5}
            placeholder="Votre message..."
            value={formData.message}
            onChange={handleChange}
            required
            className={inputBase + " resize-none"}
            autoComplete="off"
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`
              w-full py-4 rounded-xl font-bold text-lg font-montserrat
              transition-all duration-300 shadow-lg
              ${isLoading
                ? "bg-gray-400 cursor-not-allowed text-gray-600"
                : "bg-odec-gold-500 hover:bg-odec-gold-600 text-odec-blue-900 active:scale-[0.98]"}
            `}
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-5 h-5 border-2 border-odec-blue-900 border-t-transparent rounded-full animate-spin" />
                Envoi en cours...
              </span>
            ) : (
              "Envoyer le message"
            )}
          </button>
        </div>
      </form>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
};

export default ContactForm;
