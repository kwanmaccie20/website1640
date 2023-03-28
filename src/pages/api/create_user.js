import { supabaseAdmin } from "@/libs/supabase";
import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
/**
 *
 * @param {NextRequest} req
 * @param {NextResponse} res
 */
export default async function handler(req, res) {
  if (req.method != "POST") {
    res.status(405).send({ message: "Only accept POST method." });
  }
  const body = JSON.parse(req.body);
  const password = generatePassword(6);

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email: body.email,
    email_confirm: true,
    password: password,
    user_metadata: {
      email: body.email,
      department_id: body.department_id,
      role_id: body.role_id,
      first_name: body.first_name,
      last_name: body.last_name,
      phone: body.phone,
      gender: body.gender,
      address: body.address,
    },
  });
  if (error) {
    console.log(error.message, error);
    res.status(500).send({ message: "500" });
  }
  if (data) {
    fs.appendFileSync(
      "public/user.txt",
      `\nemail:${body.email} \tPassword:${password}`
    );
    //Update coordinator of the department
    const { data: roleData, error: roleError } = await supabaseAdmin
      .from("roles")
      .select("id,title")
      .eq("id", body.role_id)
      .single();
    if (roleData && roleData.title == "qa_coordinator") {
      //Update user// return current coordinator to staff
      const { data: roleStaff, error: roleStaffError } = await supabaseAdmin
        .from("roles")
        .select("id,title")
        .eq("title", "staff")
        .single();
      if (roleStaff) {
        const { data: updateCurrentCoordinator, error: updateCoorError } =
          await supabaseAdmin
            .from("staff")
            .update({ role_id: roleStaff.id })
            .eq("role_id", body.role_id)
            .eq("department_id", body.department_id)
            .neq("id", data.user.id);
      }
      //New coordinator
      const { data: departmentData, error: departmentError } =
        await supabaseAdmin
          .from("departments")
          .update({ coordinator_id: data.user.id })
          .eq("id", body.department_id);
    }
    res.status(200).send({
      message: "New staff has been added into the system.",
      data: body,
    });
  }
}

function generatePassword(length) {
  const charset =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    password += charset[randomIndex];
  }
  return password;
}
