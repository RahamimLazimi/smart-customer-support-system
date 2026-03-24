using MailKit.Net.Smtp;

using MimeKit;

public class RealEmailService {
    // BONUS: Real email sending via SMTP
    public void Send(string to, string subject, string body) {
        var email = new MimeMessage();
        email.From.Add(MailboxAddress.Parse("ramilazimi@gmail.com"));
        email.To.Add(MailboxAddress.Parse(to));
        email.Subject = subject;
        email.Body = new TextPart("plain") { Text = body };

        using var smtp = new SmtpClient();
        smtp.Connect("smtp.gmail.com", 587, false);
        smtp.Authenticate("ramilazimi@gmail.com", "app-password");
        smtp.Send(email);
        smtp.Disconnect(true);
    }
}