import { useState } from "react";
import { faqs } from "../constants/helpData";

export const useHelpCenter = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFaq, setActiveFaq] = useState(null);

  const toggleFaq = (id) => {
    setActiveFaq(activeFaq === id ? null : id);
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return {
    searchQuery,
    setSearchQuery,
    activeFaq,
    toggleFaq,
    filteredFaqs,
  };
};
