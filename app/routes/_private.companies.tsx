import { UserType } from "@prisma/client";
import { LoaderFunctionArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { Card } from "~/components/Card";
import { HeroIcon } from "~/components/HeroIcon";
import {
  AtIcon,
  CompaniesIcon,
  CompaniesOutlineIcon,
  LinkSlantIcon,
  PencilIcon,
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
    <div className="py-3 mt-4">
      <div className="max-content">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold flex gap-2 items-end leading-none">
            <CompaniesIcon className="icon-lg" /> Empresas
          </h1>

          <a href="/companies/new" className="btn btn-sm">
            <PlusIcon className="icon-sm" /> Adicionar
          </a>
        </div>

        <div className="divider" />

        <div className="grid lg:grid-cols-2 gap-2">
          {companies.map(({ company, ...info }) => (
            <Card key={company.id} className="flex flex-col">
              <Card.Content className="flex flex-1 items-start flex-row-reverse overflow-hidden">
                <div className="min-w-24 flex flex-col justify-between self-stretch items-center">
                  {info.type === UserType.SHARED ? (
                    <HeroIcon
                      icon={LinkSlantIcon}
                      className="hero-icon-secondary"
                      label="Conjunta"
                    />
                  ) : info.owner ? (
                    <HeroIcon
                      icon={CompaniesOutlineIcon}
                      className="hero-icon-primary"
                      label="Proprietário"
                    />
                  ) : (
                    <HeroIcon
                      icon={CompaniesOutlineIcon}
                      className="opacity-70"
                    />
                  )}
                </div>

                <div className="divider divider-horizontal mx-1" />

                <div className="flex flex-col gap-3 flex-1 light:text-neutral-700">
                  <div>
                    <h3 className="text-lg font-bold leading-none">
                      {company.name}
                    </h3>
                    {company.alias && (
                      <h4 className="font-bold text-dim">{company.alias}</h4>
                    )}
                  </div>
                  <div className="flex gap-1 items-center overflow-hidden">
                    <AtIcon />
                    <div className="flex flex-col">
                      <div className="text-ellipsis overflow-hidden font-bold -leading-none">
                        {company.email.split("@")[0]}
                      </div>
                      <div className="text-sm text-dim leading-none">
                        {company.email.split("@")[1]}
                      </div>
                    </div>
                  </div>
                </div>
              </Card.Content>

              <Card.Footer className="flex justify-between items-center">
                <button className="btn btn-xs btn-error btn-outline border-transparent bg-transparent btn-circle">
                  <TrashIcon className="icon-sm" />
                </button>

                <div className="flex gap-2">
                  <button className="btn btn-xs btn-base-ghost w-full">
                    <PencilIcon className="icon-sm" /> Editar
                  </button>
                </div>
              </Card.Footer>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
