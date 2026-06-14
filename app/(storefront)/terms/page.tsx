import React from 'react';
import { ShieldCheck, ScrollText } from 'lucide-react';

export const metadata = {
  title: 'Terms & Conditions - ShopEasy',
  description: 'Read the terms and conditions for using ShopEasy services.',
};

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-12">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <ScrollText className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Terms & Conditions
        </h1>
        <p className="text-lg text-muted-foreground">
          Last updated: June 2026
        </p>
      </div>

      {/* Content */}
      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-a:text-primary">
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-10 space-y-8">
          <section>
            <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
              <ShieldCheck className="h-6 w-6 text-primary" />
              1. Introduction
            </h2>
            <p>
              Welcome to ShopEasy. These terms and conditions outline the rules and regulations for the use of ShopEasy's Website, located at shopeasy.co.ke.
              By accessing this website, we assume you accept these terms and conditions. Do not continue to use ShopEasy if you do not agree to take all of the terms and conditions stated on this page.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Purchases and Payments</h2>
            <p>
              We accept payments via M-Pesa. By submitting an order, you agree to pay the stipulated prices. All prices are in Kenyan Shillings (KES). ShopEasy reserves the right to refuse or cancel your order at any time for reasons including but not limited to: product or service availability, errors in the description or price of the product or service, or error in your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Shipping and Delivery</h2>
            <p>
              Delivery times are estimates and commence from the date of shipping, rather than the date of order. Delivery times are to be used as a guide only and are subject to the acceptance and approval of your order. Unless there are exceptional circumstances, we make every effort to fulfill your order within [1-4] business days of the date of your order.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Returns and Refunds</h2>
            <p>
              Our Return Policy forms a part of these Terms and Conditions. Please read our Return Policy to learn more about your right to cancel your order. Your right to return an order only applies to products that are returned in the same condition as you received them.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Limitation of Liability</h2>
            <p>
              In no event shall ShopEasy, nor any of its officers, directors and employees, be held liable for anything arising out of or in any way connected with your use of this website whether such liability is under contract. ShopEasy, including its officers, directors and employees shall not be held liable for any indirect, consequential or special liability arising out of or in any way related to your use of this website.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
