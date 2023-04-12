import AppLayout from "@/layouts/AppLayout";
import { Container, TypographyStylesProvider } from "@mantine/core";
import React from "react";

export default function Terms() {
  return (
    <Container>
      <TypographyStylesProvider>
        <h1>Terms and Conditions</h1>
        <p>
          Please read these terms and conditions carefully before using the
          website.
        </p>
        <h2>1. Submission of Ideas</h2>
        <p>
          Staff members of the university are allowed to upload their campaign
          ideas within the current academic year.
        </p>
        <p>
          The uploaded ideas should be original and not infringe on any
          intellectual property rights of third parties.
        </p>
        <h2>2. Ownership of Ideas</h2>
        <p>
          By submitting an idea, you acknowledge that the university will own
          all intellectual property rights to the idea, including but not
          limited to copyrights, patents, and trademarks.
        </p>
        <h2>3. Confidentiality</h2>
        <p>
          The university will take reasonable measures to protect the
          confidentiality of the uploaded ideas.
        </p>
        <p>
          However, the university cannot guarantee the absolute confidentiality
          of the uploaded ideas and will not be liable for any unauthorized
          access or disclosure of the ideas.
        </p>
        <h2>4. Moderation and Approval</h2>
        <p>
          The university reserves the right to review, moderate, and approve the
          uploaded ideas at its sole discretion.
        </p>
        <p>
          The university may reject or remove any idea that violates these terms
          and conditions, is offensive, or otherwise inappropriate.
        </p>
        <h2>5. Liability and Indemnity</h2>
        <p>
          The university will not be liable for any damages, losses, or expenses
          arising from the use of the website or the submission of ideas.
        </p>
        <p>
          You agree to indemnify and hold the university harmless from any
          claims, damages, or liabilities arising from your submission of ideas
          or your use of the website.
        </p>
        <h2>6. Changes to Terms and Conditions</h2>
        <p>
          The university reserves the right to modify or update these terms and
          conditions at any time without prior notice.
        </p>
        <p>
          It is your responsibility to review these terms and conditions
          periodically for any changes.
        </p>
        <h2>7. Governing Law and Jurisdiction</h2>
        <p>
          These terms and conditions shall be governed by and construed in
          accordance with the laws of Vietnam, without regard to its conflict of
          law provisions.
        </p>
        <p>
          Any disputes arising out of or in connection with these terms and
          conditions shall be subject to the exclusive jurisdiction of the
          courts of Vietnam.
        </p>
        <h2>8. Contact Us</h2>
        <p>
          If you have any questions or concerns about these terms and
          conditions, please contact us at{" "}
          <a href="mailto:duynntgcc19026@fpt.edu.vn">
            duynntgcc19026@fpt.edu.vn
          </a>
          , or{" "}
          <a href="mailto:khangnvgcc19118@fpt.edu.vn">
            khangnvgcc19118@fpt.edu.vn
          </a>
          , or{" "}
          <a href="mailto:huylagcc19056@fpt.edu.vn">huylagcc19056@fpt.edu.vn</a>
          .
        </p>
      </TypographyStylesProvider>
    </Container>
  );
}

Terms.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Terms and Conditions",
    },
  };
}
