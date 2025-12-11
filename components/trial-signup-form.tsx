"use client";

import type React from "react";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowRight, ArrowLeft } from "lucide-react";

type FormData = {
	parentName: string;
	email: string;
	whatsapp: string;
	childName: string;
	childAge: string;
	childInterests: string;
	country: string;
	city: string;
	trialDate: string;
	trialTime: string;
};

export function TrialSignupForm() {
	const { toast } = useToast();
	const [currentStep, setCurrentStep] = useState(0);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isSuccess, setIsSuccess] = useState(false);
	const [formData, setFormData] = useState<FormData>({
		parentName: "",
		email: "",
		whatsapp: "",
		childName: "",
		childAge: "",
		childInterests: "",
		country: "",
		city: "",
		trialDate: "",
		trialTime: "",
	});

	const steps = [
		{ id: 0, title: "Parent Information", field: "parentName" },
		{ id: 1, title: "Contact Details", fields: ["email", "whatsapp"] },
		{
			id: 2,
			title: "Child Information",
			fields: ["childName", "childAge", "childInterests"],
		},
		{ id: 3, title: "Location", fields: ["country", "city"] },
		{ id: 4, title: "Schedule", fields: ["trialDate", "trialTime"] },
	];

	const totalSteps = steps.length;
	const progress = ((currentStep + 1) / totalSteps) * 100;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsSubmitting(true);

		try {
			const res = await fetch("/api/register", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(formData),
			});

			const data = await res.json();

			if (!data.success) {
				throw new Error("Failed to save");
			}

			setIsSuccess(true);

			toast({
				title: "Registration Successful!",
				description: "We'll contact you shortly to confirm your trial class.",
			});
		} catch (err) {
			console.error(err);
			toast({
				title: "Error",
				description: "Something went wrong. Please try again.",
				variant: "destructive",
			});
		}

		setIsSubmitting(false);
	};

	const handleChange = (field: keyof FormData, value: string) => {
		setFormData((prev) => ({ ...prev, [field]: value }));
	};

	const handleNext = () => {
		if (currentStep < totalSteps - 1) {
			setCurrentStep(currentStep + 1);
		}
	};

	const handleBack = () => {
		if (currentStep > 0) {
			setCurrentStep(currentStep - 1);
		}
	};

	const isStepValid = () => {
		switch (currentStep) {
			case 0:
				return formData.parentName.trim() !== "";
			case 1:
				return formData.email.trim() !== "" && formData.whatsapp.trim() !== "";
			case 2:
				return (
					formData.childName.trim() !== "" && formData.childAge.trim() !== ""
				);
			case 3:
				return formData.country.trim() !== "" && formData.city.trim() !== "";
			case 4:
				return (
					formData.trialDate.trim() !== "" && formData.trialTime.trim() !== ""
				);
			default:
				return false;
		}
	};

	const handleReset = () => {
		setIsSuccess(false);
		setCurrentStep(0);
		setFormData({
			parentName: "",
			email: "",
			whatsapp: "",
			childName: "",
			childAge: "",
			childInterests: "",
			country: "",
			city: "",
			trialDate: "",
			trialTime: "",
		});
	};

	if (isSuccess) {
		return (
			<Card className='border-2 border-accent shadow-lg'>
				<CardContent className='pt-12 pb-12 flex flex-col items-center justify-center text-center gap-4'>
					<CheckCircle2 className='w-16 h-16 text-accent' />
					<h3 className='text-2xl font-bold'>
						Thank You, {formData.parentName}!
					</h3>
					<p className='text-muted-foreground max-w-md'>
						We've received {formData.childName}'s trial class registration for{" "}
						{formData.trialDate} at {formData.trialTime}. We'll contact you
						shortly to confirm the details.
					</p>
					<Button
						onClick={handleReset}
						variant='outline'
						className='mt-4 bg-transparent'
					>
						Register Another Child
					</Button>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className='shadow-lg border-2'>
			<CardContent className='pt-6'>
				<div className='mb-8'>
					<div className='flex justify-between mb-2 text-sm font-medium'>
						<span className='text-foreground'>
							Step {currentStep + 1} of {totalSteps}
						</span>
						<span className='text-muted-foreground'>
							{steps[currentStep].title}
						</span>
					</div>
					<div className='h-2 bg-muted rounded-full overflow-hidden'>
						<div
							className='h-full bg-accent transition-all duration-500 ease-out'
							style={{ width: `${progress}%` }}
						/>
					</div>
				</div>

				<form onSubmit={handleSubmit} className='space-y-6'>
					{currentStep === 0 && (
						<div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
							<div className='space-y-2'>
								<h2 className='text-2xl font-bold text-balance'>
									Welcome! Let's get started.
								</h2>
								<p className='text-muted-foreground text-pretty'>
									First, we'd love to know your name.
								</p>
							</div>
							<div className='space-y-2'>
								<Label htmlFor='parentName'>Your Name</Label>
								<Input
									id='parentName'
									placeholder='Enter your full name'
									value={formData.parentName}
									onChange={(e) => handleChange("parentName", e.target.value)}
									autoFocus
									className='text-lg'
								/>
							</div>
						</div>
					)}

					{currentStep === 1 && (
						<div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
							<div className='space-y-2'>
								<h2 className='text-2xl font-bold text-balance'>
									Great, {formData.parentName}!
								</h2>
								<p className='text-muted-foreground text-pretty'>
									How can we reach you?
								</p>
							</div>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='email'>Email Address</Label>
									<Input
										id='email'
										type='email'
										placeholder='your.email@example.com'
										value={formData.email}
										onChange={(e) => handleChange("email", e.target.value)}
										autoFocus
										className='text-lg'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='whatsapp'>WhatsApp Number</Label>
									<Input
										id='whatsapp'
										type='tel'
										placeholder='+1 234 567 8900'
										value={formData.whatsapp}
										onChange={(e) => handleChange("whatsapp", e.target.value)}
										className='text-lg'
									/>
									<p className='text-xs text-muted-foreground'>
										Include country code for best results
									</p>
								</div>
							</div>
						</div>
					)}

					{currentStep === 2 && (
						<div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
							<div className='space-y-2'>
								<h2 className='text-2xl font-bold text-balance'>
									Nice to meet you, {formData.parentName}!
								</h2>
								<p className='text-muted-foreground text-pretty'>
									Now, tell us about your child.
								</p>
							</div>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='childName'>Child's Name</Label>
									<Input
										id='childName'
										placeholder="Enter your child's name"
										value={formData.childName}
										onChange={(e) => handleChange("childName", e.target.value)}
										autoFocus
										className='text-lg'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='childAge'>Child's Age</Label>
									<Input
										id='childAge'
										type='number'
										min='1'
										max='18'
										placeholder='Enter age'
										value={formData.childAge}
										onChange={(e) => handleChange("childAge", e.target.value)}
										className='text-lg'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='childInterests'>Interests (Optional)</Label>
									<Input
										id='childInterests'
										placeholder='e.g., Music, Sports, Art...'
										value={formData.childInterests}
										onChange={(e) =>
											handleChange("childInterests", e.target.value)
										}
										className='text-lg'
									/>
									<p className='text-xs text-muted-foreground'>
										This helps us personalize the trial class
									</p>
								</div>
							</div>
						</div>
					)}

					{currentStep === 3 && (
						<div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
							<div className='space-y-2'>
								<h2 className='text-2xl font-bold text-balance'>
									Where are you located?
								</h2>
								<p className='text-muted-foreground text-pretty'>
									This helps us schedule the class in your local time.
								</p>
							</div>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='country'>Country</Label>
									<Input
										id='country'
										placeholder='Enter your country'
										value={formData.country}
										onChange={(e) => handleChange("country", e.target.value)}
										autoFocus
										className='text-lg'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='city'>City</Label>
									<Input
										id='city'
										placeholder='Enter your city'
										value={formData.city}
										onChange={(e) => handleChange("city", e.target.value)}
										className='text-lg'
									/>
								</div>
							</div>
						</div>
					)}

					{currentStep === 4 && (
						<div className='space-y-6 animate-in fade-in slide-in-from-right-4 duration-500'>
							<div className='space-y-2'>
								<h2 className='text-2xl font-bold text-balance'>
									When would you like the trial class?
								</h2>
								<p className='text-muted-foreground text-pretty'>
									Choose a date and time that works best for{" "}
									{formData.childName} in your local timezone.
								</p>
							</div>
							<div className='space-y-4'>
								<div className='space-y-2'>
									<Label htmlFor='trialDate'>Preferred Date</Label>
									<Input
										id='trialDate'
										type='date'
										value={formData.trialDate}
										onChange={(e) => handleChange("trialDate", e.target.value)}
										autoFocus
										min={new Date().toISOString().split("T")[0]}
										className='text-lg'
									/>
								</div>
								<div className='space-y-2'>
									<Label htmlFor='trialTime'>Preferred Time</Label>
									<Input
										id='trialTime'
										type='time'
										value={formData.trialTime}
										onChange={(e) => handleChange("trialTime", e.target.value)}
										className='text-lg'
									/>
									<p className='text-xs text-muted-foreground'>
										Time in your local timezone ({formData.city},{" "}
										{formData.country})
									</p>
								</div>
							</div>
						</div>
					)}

					<div className='flex gap-3 pt-4'>
						{currentStep > 0 && (
							<Button
								type='button'
								variant='outline'
								onClick={handleBack}
								className='flex-1 bg-transparent'
								size='lg'
							>
								<ArrowLeft className='w-4 h-4 mr-2' />
								Back
							</Button>
						)}
						{currentStep < totalSteps - 1 ? (
							<Button
								type='button'
								onClick={handleNext}
								disabled={!isStepValid()}
								className='flex-1'
								size='lg'
							>
								Continue
								<ArrowRight className='w-4 h-4 ml-2' />
							</Button>
						) : (
							<Button
								type='submit'
								disabled={!isStepValid() || isSubmitting}
								className='flex-1'
								size='lg'
							>
								{isSubmitting ? "Submitting..." : "Book Trial Class"}
							</Button>
						)}
					</div>
				</form>
			</CardContent>
		</Card>
	);
}
