const faqs = [
  ["Are the products one-of-one?", "Most Meshabek pieces are single-stock thrift finds. If the product sells out, it may not return."],
  ["How does delivery work?", "After checkout, the team confirms the order by phone and shares delivery cost and timing based on your governorate."],
  ["Can I exchange an item?", "Exchange requests depend on item condition and availability. Contact the store within 24 hours after receiving your order."],
  ["How accurate are sizes?", "Each item lists available sizes. For a live store, you can extend the schema with exact measurements."]
];

const FAQ = () => (
  <section className="container-page py-10">
    <p className="label">FAQ</p>
    <h1 className="font-display text-5xl font-black">Questions shoppers ask</h1>
    <div className="mt-8 grid gap-4">
      {faqs.map(([question, answer]) => (
        <details key={question} className="rounded-lg border border-ink/10 bg-linen p-5">
          <summary className="cursor-pointer font-bold">{question}</summary>
          <p className="mt-3 leading-7 text-ink/62">{answer}</p>
        </details>
      ))}
    </div>
  </section>
);

export default FAQ;
