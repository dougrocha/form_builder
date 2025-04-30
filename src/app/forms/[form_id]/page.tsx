import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { caller, HydrateClient } from "~/trpc/server";
import SubmissionForm from "./form";
import { notFound } from "next/navigation";
import type { Metadata, ResolvingMetadata } from "next";

type Props = {
  params: Promise<{ form_id: string }>;
};

export async function generateMetadata(
  { params }: Props,
  _parent: ResolvingMetadata,
): Promise<Metadata> {
  // read route params
  const { form_id } = await params;

  // fetch data
  const form = await caller.form.getForm({ id: Number(form_id) });

  return {
    title: form?.title,
  };
}

export default async function FormPage({ params }: Props) {
  const { form_id } = await params;
  const form = await caller.form.getForm({ id: Number(form_id) });

  if (!form) {
    return notFound();
  }

  return (
    <div className="container mx-auto max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{form.title}</CardTitle>
          <CardDescription>{form.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <HydrateClient>
            <SubmissionForm form={form} />
          </HydrateClient>
        </CardContent>
      </Card>
    </div>
  );
}
