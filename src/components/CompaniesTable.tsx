import { trpc } from "@/utils/trpc";
import Link from "next/link";

export const CompaniesTable = () => {
  const companies = trpc.useQuery(["company.getAll"]);

  function copyShareLink(companyId: string) {
    navigator.clipboard
      .writeText(
        `${window.location.protocol}//${window.location.host}/api/share?type=company&value=${companyId}`
      )
      .then(() => alert("Link copied"));
  }

  return (
    <>
      <h1 className="text-xl leading-normal font-extrabold">Companies</h1>

      <div className="border border-base-300 rounded-md mt-4">
        <table className="table table-zebra w-full m-0">
          <thead>
            <tr>
              <th></th>
              <th>Name</th>
              <th>Invoices</th>
              <th>Owner</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {companies.data?.map((company, i) => (
              <tr key={company.id}>
                <th>{i + 1}</th>
                <td>{company.name}</td>
                <td>2</td>
                <td>
                  <div className="input-group">
                    <input type="checkbox" className="toggle" checked={false} />
                  </div>
                </td>
                <td>
                  <div className="flex gap-1 justify-end">
                    <Link href={`/company/${company.id}`}>
                      <a className="btn btn-xs btn-primary">e</a>
                    </Link>
                    <button
                      className="btn btn-xs btn-primary"
                      onClick={() => copyShareLink(company.id)}
                    >
                      s
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};
