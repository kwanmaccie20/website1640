import { supabaseAdmin } from "@/libs/supabase";
import { NextRequest, NextResponse } from "next/server";
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
  const { data: getStaffRole, error: getStaffRoleError } = await supabaseAdmin
    .from("staff")
    .select("id,role_id")
    .eq("id", body.id)
    .single();
  if (getStaffRole && getStaffRole.role_id != 3) {
    const { data, error } = await supabaseAdmin.auth.admin.deleteUser(body.id);
    if (error) {
      console.log(error);
      res.status(500).send({ message: "500" });
    }
    if (data)
      res.status(200).send({
        message: "New staff has been deleted into the system.",
        data,
      });
  } else {
    console.log(getStaffRoleError);
    res.status(500).send({ message: "500" });
  }
}
