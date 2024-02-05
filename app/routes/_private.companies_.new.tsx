import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { redirect, typedjson } from "remix-typedjson";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import {
  ArrowLeftIcon,
  CheckCircleIcon,
  CompaniesIcon,
} from "~/components/Icons";
import { InputGroup } from "~/components/InputGroup";
import { requireUser } from "~/services/auth.server";
import prisma from "~/services/prisma.server";

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

const validator = withZod(
  z.object({
    name: z.string().min(1, { message: "Campo obrigatório" }),
    alias: z.string().optional(),
    email: z
      .string()
      .email("Email inválido")
      .min(1, { message: "Campo obrigatório" }),
    address: z.string().min(1, { message: "Campo obrigatório" }),
    owner: z.boolean({
      required_error: "Campo obrigatório",
      invalid_type_error: "Campo inválido",
    }),
    currency: z.enum(["BRL", "USD"]),
    invoiceNumberPattern: z.string().min(1, { message: "Campo obrigatório" }),
  })
);

export async function action({ request }: ActionFunctionArgs) {
  const data = await request.formData();

  const result = await validator.validate(data);

  if (result.error) {
    throw validationError(result.error);
  }

  return redirect("/companies");
}

export default function CreateCompany() {
  const navigate = useNavigate();

  return (
    <div className="max-content lg:!max-w-xl lg:mx-auto mt-4">
      <div>
        <h1 className="text-2xl font-bold flex gap-2 items-end leading-none">
          <CompaniesIcon className="icon-lg" /> Empresa
        </h1>
        <div className="divider" />
      </div>

      <ValidatedForm validator={validator} method="post" className="grid gap-5">
        <InputGroup name="name" label="Razão Social">
          <input
            name="name"
            type="text"
            className="input input-bordered w-full group-aria-[invalid='true']:input-error"
          />
        </InputGroup>

        <InputGroup name="alias" label="Nome Fantasia" helper="opcional">
          <input
            name="alias"
            type="text"
            className="input input-bordered w-full group-aria-[invalid='true']:input-error"
          />
        </InputGroup>

        <InputGroup name="email" label="Email">
          <input
            name="email"
            type="email"
            className="input input-bordered w-full group-aria-[invalid='true']:input-error"
          />
        </InputGroup>

        <InputGroup name="address" label="Endereço">
          <input
            name="address"
            type="text"
            className="input input-bordered w-full group-aria-[invalid='true']:input-error"
            placeholder="Rua, número - Cidade/Estado, País"
          />
        </InputGroup>

        <div className="grid grid-cols-2 gap-3">
          <InputGroup name="owner" label="Proprietário">
            <div className="relative h-12 w-fit">
              <input type="checkbox" className="toggle toggle-xl" />

              <div className="flex items-center absolute left-0 top-0 w-full h-full pointer-events-none">
                <div className="flex-1 grid place-items-center text-base-100">
                  Não
                </div>
                <div className="flex-1 grid place-items-center text-base-100">
                  Sim
                </div>
              </div>
            </div>
          </InputGroup>

          <InputGroup name="currency" label="Moeda">
            <div className="relative">
              <select
                name="currency"
                className="select select-bordered w-full group-aria-[invalid='true']:input-error"
              >
                <option value="USD">$ - USD</option>
                <option value="BRL">R$ - BRL</option>
              </select>
            </div>
          </InputGroup>
        </div>

        <InputGroup name="invoiceNumberPattern" label="Padrão do Número">
          <input
            name="invoiceNumberPattern"
            type="text"
            className="input input-bordered w-full group-aria-[invalid='true']:input-error"
            placeholder="INV-%Y/%0[4]"
          />
        </InputGroup>

        <div>
          <div className="divider" />

          <div className="flex justify-between">
            <button onClick={() => navigate(-1)} className="btn">
              <ArrowLeftIcon /> Voltar
            </button>
            <button type="submit" className="btn btn-primary">
              <CheckCircleIcon /> Confirmar
            </button>
          </div>
        </div>
      </ValidatedForm>
    </div>
  );
}
