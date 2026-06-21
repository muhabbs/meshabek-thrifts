import { Instagram, Mail, Phone } from "lucide-react";

const Contact = () => (
  <section className="container-page py-10">
    <p className="label">Contact</p>
    <h1 className="font-display text-5xl font-black">Talk to Meshabek</h1>
    <div className="mt-8 grid gap-4 md:grid-cols-3">
      {[
        { icon: Phone, title: "Phone", body: "0100 000 0000" },
        { icon: Instagram, title: "Instagram", body: "@meshabek.store" },
        { icon: Mail, title: "Email", body: "hello@meshabek.store" }
      ].map(({ icon: Icon, title, body }) => (
        <div key={title} className="rounded-lg border border-ink/10 bg-linen p-6">
          <Icon size={24} className="text-rust" />
          <h2 className="mt-4 font-bold">{title}</h2>
          <p className="mt-2 text-ink/60">{body}</p>
        </div>
      ))}
    </div>
  </section>
);

export default Contact;
