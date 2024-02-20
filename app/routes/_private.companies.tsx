import { UserType } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Card } from "~/components/Card";
import { EmptyState } from "~/components/EmptyState";
import {
  CompaniesOutlineIcon,
  EmailIcon,
  PlusIcon,
  TrashIcon,
} from "~/components/Icons";
import { requireUser } from "~/services/auth.server";
import prisma from "~/services/prisma.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request);

  const companies = await prisma.companiesOnUsers.findMany({
    include: {
      company: true,
      sharedBy: true,
    },
    where: {
      userId: user.id,
    },
  });

  return typedjson({
    companies,
  });
}

export default function Companies() {
  const { companies } = useTypedLoaderData<typeof loader>();

  return (
    <div className="py-8 px-4 max-content">
      <div className="flex gap-2 justify-between items-center">
        <h1 className="text-2xl font-bold flex gap-2 items-end leading-none">
          Empresas
        </h1>

        <a href="/companies/new" className="btn btn-sm rounded-md">
          <PlusIcon className="icon-sm" /> Adicionar
        </a>
      </div>

      <div className="divider mb-6" />

      <div className="grid md:grid-cols-2 gap-2">
        {companies.length === 0 && (
          <EmptyState
            title="Nenhuma empresa"
            description="Você ainda não cadastrou nenhuma empresa"
            icon={CompaniesOutlineIcon}
          >
            <a
              href="/companies/new"
              className="btn btn-sm rounded-md text-white"
            >
              <PlusIcon className="icon-sm" /> Cadastrar Empresa
            </a>
          </EmptyState>
        )}

        {companies.map(({ company, ...info }) => (
          <Card key={company.id} className="">
            <Card.Content className="grid grid-cols-[1fr_auto] gap-y-2">
              {company.alias ? (
                <div className="flex flex-col">
                  <a
                    href={`/companies/${company.id}`}
                    className="font-bold leading-none underline"
                  >
                    {company.name}
                  </a>
                  <span className="text-sm text-dim">{company.alias}</span>
                </div>
              ) : (
                <h4 className="font-bold">{company.name}</h4>
              )}

              {!info.owner ? (
                <div />
              ) : (
                <div className="badge badge-ghost badge-sm font-medium">
                  {info.type === UserType.SHARED
                    ? "Compartilhado"
                    : info.owner
                    ? "Proprietário"
                    : ""}
                </div>
              )}

              <div className="flex gap-1">
                <EmailIcon className="icon-sm" />
                {company.email}
              </div>

              <div className="text-end">
                <button className="btn btn-error btn-outline btn-xs">
                  <TrashIcon className="icon-xs" />
                </button>
              </div>
            </Card.Content>
          </Card>
        ))}
      </div>
    </div>
  );
}
