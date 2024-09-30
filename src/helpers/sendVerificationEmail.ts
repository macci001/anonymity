import { resend } from "@/lib/resend";
import VerificationEmail from "../../emails/verification-email";
import { ApiResponse } from "@/types/ApiResponse";

export async function sendVerificationEmail(
    email: string,
    username: string,
    verifyCode: string
) : Promise<ApiResponse> {
    try {
        await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: email,
            subject: 'SecretFeedback | verification code',
            react: VerificationEmail({username, otp: verifyCode}),
        })
        return {success: true, message: "Email sent successfully"}; 
    } catch (e) {
        console.log("failed to send email", e);
        return {success: false, message: "Failed to send an email."}
    }
}