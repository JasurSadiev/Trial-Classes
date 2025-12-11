import { NextResponse } from "next/server";
import { db } from "@/lib/firebase";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export async function POST(request: Request) {
	try {
		const body = await request.json();

		await addDoc(collection(db, "trial_registrations"), {
			...body,
			createdAt: Timestamp.now(),
		});

		return NextResponse.json({ success: true });
	} catch (error) {
		console.error(error);
		return NextResponse.json({ success: false, error }, { status: 500 });
	}
}
