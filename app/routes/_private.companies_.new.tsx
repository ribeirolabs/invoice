import { TaskSubject, UserType } from "@prisma/client";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";
import { useNavigate } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { redirect, typedjson } from "remix-typedjson";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { FormPage } from "~/components/FormPage";
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
    owner: z
      .string()
      .optional()
      .transform((value) => (value === "on" ? true : false)),
    currency: z.enum(["BRL", "USD"]),
    invoiceNumberPattern: z.string().min(1, { message: "Campo obrigatório" }),
  })
);

export async function action({ request }: ActionFunctionArgs) {
  const user = await requireUser(request);
  const payload = await request.formData();

  const result = await validator.validate(payload);

  if (result.error) {
    throw validationError(result.error);
  }

  const { owner, ...data } = result.data;

  await prisma.company.create({
    data: {
      ...data,
      users: {
        create: {
          owner,
          type: UserType.OWNED,
          userId: user.id,
        },
      },
    },
  });

  const companiesCountByOwner = await prisma.$queryRaw<
    { owner: number; count: BigInt }[]
  >`
SELECT owner, count(owner) as count FROM CompaniesOnUsers
WHERE userId = ${user.id}
GROUP BY owner`;

  const grouped = companiesCountByOwner.reduce(
    (acc, item) => {
      acc[item.owner ? "owner" : "other"] = Number(item.count);
      return acc;
    },
    { owner: 0, other: 0 }
  );

  if (grouped.owner > 0 && grouped.other > 0) {
    await prisma.task.deleteMany({
      where: {
        userId: user.id,
        subject: TaskSubject.MissingCompanies,
      },
    });
  }

  return redirect("/companies");
}

export default function CreateCompany() {
  const navigate = useNavigate();

  return (
    <FormPage title="Empresa" icon={CompaniesIcon}>
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
              <input
                type="checkbox"
                name="owner"
                className="toggle toggle-xl"
              />

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
    </FormPage>
  );
}
