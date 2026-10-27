"use client";
import Link from "next/link";
import type { ComponentProps } from "react";
import { retailPath, useRetailRuntime } from "./RetailRuntime";
export default function RetailLink(props: ComponentProps<typeof Link>) {
  const runtime = useRetailRuntime();
  return <Link {...props} href={typeof props.href === "string" ? retailPath(props.href, runtime) : props.href} />;
}
