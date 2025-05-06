import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { ChevronLeft, ChevronRight } from "lucide-react";
interface Props {
  page: number;
  pageSize: number;
  pathname?: string;
  isLink?: boolean;
  onClick?: (pageNumber: number) => void;
}

const RANGE = 2;

export default function AutoPagination({
  page,
  pageSize,
  pathname = "/",
  isLink,
  onClick = (pageNumber) => {},
}: Props) {
  const renderPagination = () => {
    let dotAfter = false;
    let dotBefore = false;

    const renderDotBefore = () => {
      if (!dotBefore) {
        dotBefore = true;
        return (
          <PaginationItem key="dot-before">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      return null;
    };

    const renderDotAfter = () => {
      if (!dotAfter) {
        dotAfter = true;
        return (
          <PaginationItem key="dot-after">
            <PaginationEllipsis />
          </PaginationItem>
        );
      }
      return null;
    };

    return Array(pageSize)
      .fill(0)
      .map((_, index) => {
        const pageNumber = index + 1;

        if (pageNumber === 1 || pageNumber === pageSize) {
          // Hiển thị trang đầu và trang cuối
          return (
            <PaginationItem key={index}>
              {isLink ? (
                <PaginationLink
                  href={{
                    pathname,
                    query: {
                      page: pageNumber,
                    },
                  }}
                  isActive={pageNumber === page}
                >
                  {pageNumber}
                </PaginationLink>
              ) : (
                <Button
                  onClick={() => onClick(pageNumber)}
                  variant={pageNumber === page ? "outline" : "ghost"}
                  className="w-9 h-9 p-0"
                >
                  {pageNumber}
                </Button>
              )}
            </PaginationItem>
          );
        }

        if (pageNumber >= page - RANGE && pageNumber <= page + RANGE) {
          // Hiển thị các trang xung quanh trang hiện tại
          return (
            <PaginationItem key={index}>
              {isLink ? (
                <PaginationLink
                  href={{
                    pathname,
                    query: {
                      page: pageNumber,
                    },
                  }}
                  isActive={pageNumber === page}
                >
                  {pageNumber}
                </PaginationLink>
              ) : (
                <Button
                  onClick={() => onClick(pageNumber)}
                  variant={pageNumber === page ? "outline" : "ghost"}
                  className="w-9 h-9 p-0"
                >
                  {pageNumber}
                </Button>
              )}
            </PaginationItem>
          );
        }

        if (pageNumber < page - RANGE && pageNumber > 1) {
          return renderDotBefore();
        }

        if (pageNumber > page + RANGE && pageNumber < pageSize) {
          return renderDotAfter();
        }

        return null;
      });
  };

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <Button
            disabled={page === 1}
            className={"h-9 p-0 px-2 "}
            variant={"ghost"}
            onClick={() => {
              if (page > 1) onClick(page - 1);
            }}
          >
            <ChevronLeft className="w-5 h-5" />
            Previous
          </Button>
        </PaginationItem>

        {renderPagination()}

        <PaginationItem>
          <Button
            disabled={page === pageSize}
            className={"h-9 p-0 px-2"}
            variant={"ghost"}
            onClick={() => {
              if (page < pageSize) onClick(page + 1);
            }}
          >
            Next <ChevronRight className="w-5 h-5" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
