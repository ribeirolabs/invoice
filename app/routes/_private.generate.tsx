import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { format } from "date-fns";
import { FormEvent } from "react";
import {
  redirect,
  typedjson,
  useTypedFetcher,
  useTypedLoaderData,
} from "remix-typedjson";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { FormPage } from "~/components/FormPage";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  DocumentPlusIcon,
} from "~/components/Icons";
import { InputGroup } from "~/components/InputGroup";
import { getLatestInvoiceFromCompanies } from "~/data/invoice.server";
import { requireUser } from "~/services/auth.server";
import prisma from "~/services/prisma.server";
import { cn, getCurrencySymbol } from "~/utils";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  const companies = await prisma.companiesOnUsers.findMany({
    include: {
      company: true,
    },
    where: {
      userId: user.id,
    },
  });

  const fromUser: typeof companies = [];
  const fromOther: typeof companies = [];

  for (const company of companies) {
    if (company.owner) {
      fromUser.push(company);
    } else {
      fromOther.push(company);
    }
  }

  return typedjson({
    fromUser,
    fromOther,
  });
}

const INTENTS = {
  generate: "generate",
  getLatest: "getLatest",
};

const VALIDATORS = {
  generate: withZod(
    z.object({
      intent: z.literal(INTENTS.generate),
      receiver: z.string().min(1, { message: "Campo obrigatório" }),
      payer: z.string().min(1, { message: "Campo obrigatório" }),
      issueDate: z.string().min(1, { message: "Campo obrigatório" }),
      dueDate: z.string().min(1, { message: "Campo obrigatório" }),
      description: z.string().min(1, { message: "Campo obrigatório" }),
      amount: z.coerce
        .number({
          invalid_type_error: "Valor inválido",
        })
        .positive({
          message: "Valor inválido",
        })
        .min(0),
    })
  ),
  getLatest: withZod(
    z.object({
      intent: z.literal(INTENTS.getLatest),
      receiver: z.string().cuid(),
      payer: z.string().cuid(),
    })
  ),
};

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();
  const intent = data.get("intent") as string;

  if (intent === INTENTS.getLatest) {
    const result = await VALIDATORS.getLatest.validate(data);

    if (result.error) {
      throw validationError(result.error);
    }

    const invoice = await getLatestInvoiceFromCompanies(
      result.data.payer,
      result.data.receiver
    );

    return typedjson({
      ok: true,
      intent: INTENTS.getLatest,
      invoice,
    });
  }

  if (intent === INTENTS.generate) {
    const result = await VALIDATORS.generate.validate(data);

    if (result.error) {
      throw validationError(result.error);
    }

    return redirect("/");
  }

  throw typedjson({
    ok: false,
    error: "Invalid intent",
  });
}

export default function Generate() {
  const fetcher = useTypedFetcher<typeof action>();
  const { fromUser, fromOther } = useTypedLoaderData<typeof loader>();

  function onFormChange(e: FormEvent<HTMLFormElement>) {
    const data = new FormData(e.currentTarget);

    if (data.get("receiver") && data.get("payer")) {
      data.set("intent", INTENTS.getLatest);

      fetcher.submit(data, {
        method: "POST",
      });
    }
  }

  const latestInvoice = fetcher.data?.invoice;
  const latestId = latestInvoice?.id ?? "default";

  const hasCompanies = fromUser.length > 0 && fromOther.length > 0;

  return (
    <FormPage title="Invoice" icon={DocumentPlusIcon}>
      {hasCompanies ? null : <CompaniesAlert />}

      <ValidatedForm
        validator={VALIDATORS.generate}
        method="post"
        className="grid gap-5"
        onChange={onFormChange}
      >
        <div className="grid lg:grid-cols-2 gap-5 lg:gap-3">
          <InputGroup name="receiver" label="Recebedor">
            <select
              name="receiver"
              className="select select-bordered w-full group-aria-[invalid='true']:input-error"
            >
              {fromUser.map(({ company }) => (
                <option key={company.id} value={company.id}>
                  {company.alias ?? company.name}
                </option>
              ))}
            </select>
          </InputGroup>

          <InputGroup name="payer" label="Pagador">
            <select
              name="payer"
              className="select select-bordered w-full group-aria-[invalid='true']:input-error"
            >
              <option></option>
              {fromOther.map(({ company }) => (
                <option key={company.id} value={company.id}>
                  {company.alias ?? company.name}
                </option>
              ))}
            </select>
          </InputGroup>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <InputGroup name="issueDate" label="Emissão">
            <input
              name="issueDate"
              type="date"
              className="input input-bordered w-full group-aria-[invalid='true']:input-error"
              defaultValue={format(new Date(), "yyyy-MM-dd")}
            />
          </InputGroup>

          <InputGroup name="dueDate" label="Vencimento">
            <input
              name="dueDate"
              type="date"
              className="input input-bordered w-full group-aria-[invalid='true']:input-error"
            />
          </InputGroup>
        </div>

        <InputGroup name="description" label="Descrição">
          <textarea
            name="description"
            className="textarea textarea-bordered w-full h-18 group-aria-[invalid='true']:textarea-error"
            defaultValue={latestInvoice?.description ?? ""}
            key={latestId}
          ></textarea>
        </InputGroup>

        <div className="grid lg:grid-cols-2 gap-3">
          <InputGroup name="amount" label="Valor">
            <div className="join">
              <div className="join-item bg-base-300 grid place-items-center w-14">
                {latestInvoice?.currency &&
                  getCurrencySymbol(latestInvoice.currency)}
              </div>
              <input
                key={latestId}
                name="amount"
                type="tel"
                defaultValue={latestInvoice?.amount ?? "0"}
                className={cn(
                  "input input-bordered w-full join-item",
                  "group-aria-[invalid='true']:input-error"
                )}
              />
            </div>
          </InputGroup>
        </div>
        <div>
          <div className="divider" />

          <div className="flex justify-between">
            <a href="/" className="btn">
              <ArrowLeftIcon /> Voltar
            </a>
            <button
              type="submit"
              name="intent"
              value={INTENTS.generate}
              className="btn btn-primary"
              disabled={!hasCompanies}
            >
              <CheckCircleIcon /> Confirmar
            </button>
          </div>
        </div>
      </ValidatedForm>
    </FormPage>
  );
}

function CompaniesAlert() {
  return (
    <div className="alert alert-error mb-4 leading-tight">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="icon icon-xl"
        fill="none"
        viewBox="0 0 24 24"
      >
        <path
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M13.39 3.284a3.546 3.546 0 0 0-2.78 0C7.96 4.412 1.695 14.422 1.88 17.097a3.63 3.63 0 0 0 1.424 2.645c2.212 1.677 15.181 1.677 17.394 0a3.63 3.63 0 0 0 1.424-2.645c.184-2.675-6.08-12.685-8.731-13.813Z"
          opacity=".28"
        />
        <path
          fill="currentColor"
          d="M10.232 10.293a1 1 0 0 0-1.414 1.414l1.768 1.768-1.768 1.768a1 1 0 0 0 1.414 1.414L12 14.889l1.768 1.768a1 1 0 0 0 1.414-1.414l-1.768-1.768 1.768-1.768a1 1 0 0 0-1.414-1.414L12 12.06l-1.768-1.768Z"
        />
      </svg>
      <div>
        <p>
          Você ainda não cadastrou nenhuma empresa, não é possível criar uma
          invoice.
        </p>

        <a href="/companies/new" className="block underline mt-2 font-medium">
          Cadastrar empresa
        </a>
      </div>
    </div>
  );
}
