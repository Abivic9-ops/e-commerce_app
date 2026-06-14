import React from 'react';
import { HelpCircle, Mail, Phone, MessageSquare, Truck, CreditCard, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Help Center - ShopEasy',
  description: 'Get help with your ShopEasy orders, returns, and more.',
};

const FAQS = [
  {
    question: 'How long does delivery take?',
    answer: 'Standard delivery within Nairobi takes 1-2 business days. Deliveries to other regions in Kenya take 2-4 business days via our partner courier services.',
  },
  {
    question: 'How do I pay using M-Pesa?',
    answer: 'During checkout, select M-Pesa as your payment method. You will receive an STK push prompt on your phone to enter your PIN. Once successful, your order will be confirmed immediately.',
  },
  {
    question: 'What is your return policy?',
    answer: 'We accept returns within 7 days of delivery for items in their original packaging and condition. Some items like electronics must be unopened unless defective.',
  },
  {
    question: 'Can I track my order?',
    answer: 'Yes! Once your order is dispatched, you will receive an SMS with a tracking link. You can also view the status in the Track Order page using your Order ID.',
  },
];

const CONTACT_METHODS = [
  { icon: Phone, title: 'Call Us', detail: '+254 700 000 000', sub: 'Mon-Sat, 8am-6pm' },
  { icon: Mail, title: 'Email', detail: 'support@shopeasy.co.ke', sub: 'We reply within 24hrs' },
  { icon: MessageSquare, title: 'WhatsApp', detail: '+254 700 000 000', sub: 'Fastest response' },
];

export default function HelpCenterPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-16">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <HelpCircle className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          How can we help you?
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Search our knowledge base or get in touch with our support team. We're here to ensure you have a seamless shopping experience.
        </p>
      </div>

      {/* Quick Topic Links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: Truck, title: 'Delivery & Shipping', href: '/help#delivery' },
          { icon: CreditCard, title: 'Payments & M-Pesa', href: '/help#payments' },
          { icon: RefreshCw, title: 'Returns & Refunds', href: '/help#returns' },
        ].map((topic, i) => (
          <Link
            key={i}
            href={topic.href}
            className="flex flex-col items-center justify-center p-6 bg-card border border-border rounded-2xl hover:border-primary/50 hover:shadow-md transition-all text-center"
          >
            <topic.icon className="h-6 w-6 text-primary mb-3" />
            <h3 className="font-semibold text-foreground">{topic.title}</h3>
          </Link>
        ))}
      </div>

      {/* FAQs */}
      <div className="space-y-8">
        <h2 className="text-2xl font-bold text-foreground">Frequently Asked Questions</h2>
        <div className="grid gap-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="p-6 bg-secondary/30 rounded-2xl border border-border/50">
              <h3 className="text-lg font-semibold text-foreground mb-2">{faq.question}</h3>
              <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Contact Section */}
      <div className="border-t border-border pt-16">
        <div className="text-center mb-10 space-y-2">
          <h2 className="text-2xl font-bold text-foreground">Still need help?</h2>
          <p className="text-muted-foreground">Our customer support team is available to assist you.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {CONTACT_METHODS.map((method, i) => (
            <div key={i} className="flex flex-col items-center text-center p-6 bg-card border border-border rounded-2xl">
              <method.icon className="h-6 w-6 text-primary mb-4" />
              <h3 className="font-semibold text-foreground">{method.title}</h3>
              <p className="font-medium text-primary mt-1">{method.detail}</p>
              <p className="text-xs text-muted-foreground mt-2">{method.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
