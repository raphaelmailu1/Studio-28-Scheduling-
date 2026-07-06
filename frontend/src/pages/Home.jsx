import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div>

      {/* HERO */}

      <section className="py-24 text-center">

        <h1 className="text-6xl font-bold mb-6">
          Your Hair Appointments
          <br />
          Made Simple
        </h1>

        <p className="text-xl text-gray-500 mb-8">
          Book your favourite stylist in seconds.
        </p>

        <Link
          to="/book"
          className="
            bg-black
            text-white
            px-8
            py-4
            rounded-full
            font-semibold
          "
        >
          Book Appointment
        </Link>

      </section>

      {/* SERVICES */}

      <section className="py-16">

        <h2 className="text-3xl font-bold mb-8">
          Featured Services
        </h2>

        <div className="grid md:grid-cols-4 gap-6">

          {[
            "Braiding",
            "Retight",
            "Installation",
            "Colour",
          ].map((service) => (
            <div
              key={service}
              className="
                bg-white
                p-6
                rounded-3xl
                shadow-sm
              "
            >
              <h3 className="font-semibold">
                {service}
              </h3>
            </div>
          ))}

        </div>

      </section>

    </div>
  );
}