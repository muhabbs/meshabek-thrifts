const About = () => (
  <section className="container-page grid gap-10 py-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
    <img src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?auto=format&fit=crop&w=1200&q=80" alt="Curated clothing rack" className="aspect-[4/5] rounded-lg object-cover shadow-soft" />
    <div>
      <p className="label">About Meshabek</p>
      <h1 className="font-display text-5xl font-black">Curated thrift from Egypt, styled for now.</h1>
      <p className="mt-5 leading-8 text-ink/68">
        Meshabek Store is built around the thrill of finding the piece nobody else has. Each drop is selected for fit, fabric, character, and everyday wearability, then presented with clear sizing and honest stock.
      </p>
      <p className="mt-4 leading-8 text-ink/68">
        The brand mixes vintage warmth with a clean online shopping experience: simple filters, sharp product photography, and a checkout made for local Egyptian delivery.
      </p>
    </div>
  </section>
);

export default About;
