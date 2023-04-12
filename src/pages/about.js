import AppLayout from "@/layouts/AppLayout";
import { TypographyStylesProvider } from "@mantine/core";
import Link from "next/link";
import React from "react";

export default function About() {
  return (
    <TypographyStylesProvider>
      <h1>About Us</h1>
      <p>
        Welcome to Next University Ideas! We are a platform that allows staff
        members of Next University to share their creative campaign ideas for
        the current academic year.
      </p>
      <h2>Our Mission</h2>
      <p>
        Our mission is to foster innovation and collaboration among the staff
        members of Next University by providing a platform for them to share
        their campaign ideas and contribute to the vibrant campus life.
      </p>
      <h2>How It Works</h2>
      <p>
        Next University staff members can submit their campaign ideas through
        our website by following the submission guidelines. Once submitted, the
        ideas will be reviewed by our team for approval. Approved ideas will be
        displayed on the website for other staff members to view and provide
        feedback.
      </p>
      <h2>Contact Us</h2>
      <p>
        If you have any questions or feedback about Next University Campaign
        Ideas, please feel free to contact us at{" "}
        <a href="mailto:duynntgcc19026@fpt.edu.vn">duynntgcc19026@fpt.edu.vn</a>
        , or{" "}
        <a href="mailto:khangnvgcc19118@fpt.edu.vn">
          khangnvgcc19118@fpt.edu.vn
        </a>
        , or{" "}
        <a href="mailto:huylagcc19056@fpt.edu.vn">huylagcc19056@fpt.edu.vn</a>.
        We would be happy to assist you!
      </p>
      <h2>Disclaimer</h2>
      <p>
        Next University Campaign Ideas is a platform provided by Next University
        for staff members to share their campaign ideas. The ideas and opinions
        expressed by individual staff members are their own and do not
        necessarily reflect the views or opinions of Next University. Next
        University does not endorse or guarantee the accuracy, reliability, or
        legality of any campaign ideas submitted through the website.
      </p>
      <h2>Terms and Conditions</h2>
      <p>
        By using Next University Campaign Ideas, you agree to comply with the
        terms and conditions outlined on our website. Please review our{" "}
        <Link href="/terms">Terms and Conditions</Link> for more information.
      </p>
      {/* <h2>Privacy Policy</h2>
      <p>
        Our <a href="/privacy-policy.html">Privacy Policy</a> outlines how we
        collect, use, and protect your personal information when you use Next
        University Campaign Ideas. Please review our Privacy Policy to
        understand how we handle your data.
      </p> */}
    </TypographyStylesProvider>
  );
}

About.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "About",
    },
  };
}
