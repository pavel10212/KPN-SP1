import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Image from "next/image";
import Link from "next/link";

const Hero = () => (
  <div className="bg-gray-900 text-white py-8 md:py-24">
    <div className="container mx-auto px-6">
      {/* Logo for mobile screens */}
      <div className="md:hidden flex justify-center mb-8">
        <div className="w-32 h-32 relative">
          <Image
            src="/logo5.png"
            alt="KPN Logo"
            layout="fill"
            objectFit="contain"
            className="rounded-lg shadow-lg"
          />
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center">
        <div className="md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 md:mb-6">
            Elevate Your Property Management
          </h1>
          <p className="text-base md:text-lg mb-6 md:mb-8">
            Experience the future of rental property management with our
            state-of-the-art platform.
          </p>
          <Link
            href="/login"
            className="bg-blue-500 text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded-full hover:bg-blue-600 transition duration-300 inline-block"
          >
            Get Started
          </Link>
        </div>

        {/* Logo for larger screens */}
        <div className="hidden md:block md:w-1/2">
          <div className="w-64 h-64 lg:w-80 lg:h-80 relative mx-auto">
            <Image
              src="/logo5.png"
              alt="KPN Logo"
              layout="fill"
              objectFit="contain"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
);

const AboutOurPlatform = () => (
  <div className="bg-gray-100 py-24">
    <div className="container mx-auto px-6">
      <h2 className="text-4xl font-bold text-center mb-16">
        About Our Platform
      </h2>
      <div className="grid md:grid-cols-2 gap-12">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Transforming Management</h3>
          <p className="text-gray-700 mb-6">
            Our platform integrates with channel managers like Beds24 to
            streamline communication and task management.
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Role-based dashboards</li>
            <li>Seamless integration</li>
            <li>Efficient task management</li>
            <li>Enhanced guest experience</li>
          </ul>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-2xl font-bold mb-4">Addressing Challenges</h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Time-consuming communication</li>
            <li>Inefficient guest coordination</li>
            <li>Complex transportation</li>
            <li>Frequent housekeeper inquiries</li>
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const HowItWorks = () => {
  const steps = [
    {
      title: "Connect",
      description: "Integrate with your existing channel manager, Beds24",
    },
    {
      title: "Assign",
      description: "Create teams and assign tasks effortlessly",
    },
    {
      title: "Manage",
      description: "Monitor task status and team performance in real-time",
    },
  ];

  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-gray-100 rounded-lg shadow-lg p-8 text-center transition duration-300 transform hover:scale-105"
            >
              <div className="bg-blue-500 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                {index + 1}
              </div>
              <h3 className="text-2xl font-bold mb-4">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
const TheTeam = () => {
  const teamMembers = [
    {
      name: "Noe Kieffer",
      role: "Fullstack/Frontend Developer",
      image: "/noe.jpg",
    },
    {
      name: "Pavel Ponomarev",
      role: "Fullstack/Backend Developer",
      image: "/pavel.jpg",
    },
    {
      name: "Kris Ambrosini",
      role: "Software Engineer",
      image: "/kris.png",
    },
  ];

  return (
    <div className="bg-gray-100 py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">The Team</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 text-center"
            >
              <div className="w-48 h-48 mx-auto mb-4 relative overflow-hidden">
                <Image
                  src={member.image}
                  alt={`${member.name}'s photo`}
                  fill
                  style={{ objectFit: "cover" }}
                  className="rounded-lg"
                />
              </div>
              <h3 className="text-xl font-bold mb-2">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const testimonial = {
    name: "Alex Johnson",
    role: "Property Manager",
    company: "Sunset Rentals",
    quote:
      "This platform has revolutionized our property management process. It's intuitive, efficient, and has significantly improved our team's productivity.",
  };

  return (
    <div className="bg-white py-24">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-center mb-16">Testimonials</h2>
        <div className="max-w-3xl mx-auto bg-gray-100 rounded-lg shadow-lg p-8">
          <p className="text-xl italic mb-6">"{testimonial.quote}"</p>
          <div className="flex items-center">
            <div className="w-16 h-16 bg-gray-300 rounded-full mr-4"></div>
            <div>
              <h3 className="text-lg font-bold">{testimonial.name}</h3>
              <p className="text-gray-600">
                {testimonial.role}, {testimonial.company}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Footer = () => (
  <footer className="bg-gray-900 text-white py-8">
    <div className="container mx-auto px-6 text-center">
      <p>&copy; 2024 KPN Senior Project. All rights reserved.</p>
    </div>
  </footer>
);

export default async function HomePage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Hero />
      <AboutOurPlatform />
      <HowItWorks />
      <TheTeam />
      <Testimonials />
      <Footer />
    </div>
  );
}
