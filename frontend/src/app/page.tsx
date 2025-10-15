import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Stethoscope } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { creditBenefits, features, testimonials } from "@/lib/data"; // Assuming this is now .tsx

export default function Home() {
  // Use bg-background (white/light) for the body background
  return (
    <div className="bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-10 px-2">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {/* Light Mode Badge Style */}
              <Badge
                variant="outline"
                className="bg-emerald-100 border-emerald-300 px-4 py-2 text-emerald-700 text-sm font-medium"
              >
                MediCare made simple
              </Badge>
              {/* Light Mode Text Color (text-foreground is dark/black) */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight">
                Connect with doctors <br />
                <span className="gradient-title">anytime, anywhere</span>
              </h1>
              <p className="text-muted-foreground text-lg md:text-xl max-w-md">
                Book appointments, consult via video, and manage your healthcare
                journey all in one secure platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  asChild
                  size="lg"
                  className="bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  <Link href="/login">
                    Login <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-gray-300 hover:bg-gray-100" // Adjusted for light background
                >
                  <Link href="/register">Register as Patient</Link>
                </Button>
              </div>
            </div>

            <div className="relative h-[400px] lg:h-[600px] rounded-xl overflow-hidden">
              <Image
                src="/banner2.png"
                alt="Doctor consultation"
                fill
                priority
                className="object-cover md:pt-14 rounded-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            {/* Light Mode Text Color */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              How It Works
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Our platform makes healthcare accessible with just a few clicks
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card
                key={index}
                // Light Mode Card Style
                className="bg-white border-gray-200 hover:border-emerald-300 transition-all duration-300"
              >
                <CardHeader className="pb-2">
                  {/* Light Mode Icon Container */}
                  <div className="bg-emerald-100 p-3 rounded-lg w-fit mb-4">
                    {/* Icon color is already set to text-emerald-400 in data.tsx */}
                    {feature.icon}
                  </div>
                  {/* Light Mode Text Color */}
                  <CardTitle className="text-xl font-semibold text-foreground">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section with green medical styling */}
      <section id="pricing" className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            {/* Light Mode Badge Style */}
            <Badge
              variant="outline"
              className="bg-emerald-100 border-emerald-300 px-4 py-1 text-emerald-700 text-sm font-medium mb-4"
            >
              Affordable Healthcare
            </Badge>
            {/* Light Mode Text Color */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Consultation Packages
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Choose the perfect consultation package that fits your healthcare
              needs
            </p>
          </div>

          <div className="mx-auto">
            {/* Description */}
            <Card className="mt-12 bg-white border-gray-200">
              <CardHeader>
                {/* Light Mode Text Color */}
                <CardTitle className="text-xl font-semibold text-foreground flex items-center">
                  <Stethoscope className="h-5 w-5 mr-2 text-emerald-600" />
                  How Our Credit System Works
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {creditBenefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      {/* Light Mode Icon Container */}
                      <div className="mr-3 mt-1 bg-emerald-100 p-1 rounded-full">
                        <svg
                          className="h-4 w-4 text-emerald-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          ></path>
                        </svg>
                      </div>
                      <p
                        className="text-muted-foreground"
                        dangerouslySetInnerHTML={{ __html: benefit }}
                      />
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials with green medical accents */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            {/* Light Mode Badge Style */}
            <Badge
              variant="outline"
              className="bg-emerald-100 border-emerald-300 px-4 py-1 text-emerald-700 text-sm font-medium mb-4"
            >
              Success Stories
            </Badge>
            {/* Light Mode Text Color */}
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from patients and doctors who use our platform
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                // Light Mode Card Style
                className="bg-white border-gray-200 hover:border-emerald-300 transition-all"
              >
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    {/* Light Mode Initials Background/Text */}
                    <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center mr-4">
                      <span className="text-emerald-700 font-bold">
                        {testimonial.initials}
                      </span>
                    </div>
                    <div>
                      {/* Light Mode Text Color */}
                      <h4 className="font-semibold text-foreground">
                        {testimonial.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                  <p className="text-muted-foreground">
                    &quot;{testimonial.quote}&quot;
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section with light medical styling */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <Card className="bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200">
            <CardContent className="p-8 md:p-12 lg:p-16 relative overflow-hidden">
              <div className="max-w-2xl relative z-10">
                {/* Light Mode Text Color */}
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                  Ready to take control of your healthcare?
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of users who have simplified their healthcare
                  journey with our platform. Get started today and experience
                  healthcare the way it should be.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-emerald-600 text-white hover:bg-emerald-700"
                  >
                    <Link href="/login">Login</Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="border-gray-300 hover:bg-gray-100"
                  >
                    <Link href="/register">Sign Up</Link>
                  </Button>
                </div>
              </div>

              {/* Decorative healthcare elements (subtler on light background) */}
              <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-emerald-300/20 rounded-full blur-3xl -mr-20 -mt-20"></div>
              <div className="absolute left-0 bottom-0 w-[200px] h-[200px] bg-emerald-200/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}