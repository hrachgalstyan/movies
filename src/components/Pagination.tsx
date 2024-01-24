"use client";

import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FC, useMemo, Fragment, useEffect, useCallback } from "react";

interface Pagination {
  count: number;
  perPage: number;
  showedItems: Array<any>;
}

export const Pagination: FC<Pagination> = ({ count, perPage, showedItems }) => {
  const pathname = usePathname();
  const { replace } = useRouter();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const totalPages = useMemo(
    () => Math.ceil(count / perPage),
    [count, perPage]
  );

  const changePage = useCallback(
    (pageNumber: number | string) => {
      const params = new URLSearchParams(searchParams);
      params.set("page", pageNumber.toString());
      replace(`${pathname}?${params.toString()}`);
    },
    [pathname, replace, searchParams]
  );

  useEffect(() => {
    if (!showedItems.length && currentPage > 1) {
      changePage(currentPage - 1);
    }
  }, [changePage, currentPage, showedItems.length]);

  const pages = useMemo(
    () => Array.from({ length: totalPages }, (_, i) => i + 1),
    [totalPages]
  );

  return (
    <ol className="flex justify-between items-center gap-1 text-xs font-medium">
      <li>
        <button
          onClick={() => changePage(currentPage - 1)}
          disabled={currentPage === 1}
          className="text-[16px] leading-[24px] font-bold text-white pr-4"
        >
          Prev
        </button>
      </li>
      <div className="flex gap-2">
        {pages
          .filter((page) => {
            switch (currentPage) {
              case 1:
                return page <= currentPage + 1;
              case totalPages:
                return page >= currentPage - 1;
              default:
                return page >= currentPage - 1 && page <= currentPage;
            }
          })
          .map(
            (page) => (
              <Fragment key={page.toString()}>
                <li
                  onClick={() => changePage(page)}
                  className={`inline-flex ${
                    page === currentPage ? "bg-primary" : "bg-card"
                  } h-8 w-8 items-center justify-center rounded text-[16px] leading-[24px] font-bold text-white`}
                >
                  {page}
                </li>
              </Fragment>
            ),
            []
          )}
      </div>
      <li>
        <button
          onClick={() => changePage(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="text-[16px] leading-[24px] font-bold text-white pl-4"
        >
          Next
        </button>
      </li>
    </ol>
  );
};
