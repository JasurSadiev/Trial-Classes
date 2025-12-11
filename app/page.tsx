import { TrialSignupForm } from "@/components/trial-signup-form"

export default function Page() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-background via-accent/5 to-background">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-balance">Book Your Free Trial Class</h1>
          <p className="text-lg text-muted-foreground text-pretty">
            {"Take the first step in your child's learning journey. Fill out the form below to schedule a trial class."}
          </p>
        </div>
        <TrialSignupForm />
      </div>
    </div>
  )
}
