import React from "react";
import { NavItem } from "./nav-section";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Link } from "lucide-react";
import { Icons } from "./icons";
import { signOut } from "next-auth/react";

const BottomSection = ({
  className,
  username,
  items,
}: {
  className?: string;
  username: string;
  items: NavItem[];
}) => {
  const path = usePathname();
  return (
    <>
      <div className={className}>
        <div className="flex">
          <div className="ml-2.5 h-24 w-0.5 bg-slate-300 rounded-full"></div>
          <ul role="list" className="mt-1">
            {items.map((item, index) => {
              const Icon = Icons[item.icon];
              return (
                <Link
                  className="flex items-center ml-4 my-3"
                  key={index}
                  href={item.href}
                >
                  <span
                    className={cn(
                      path.includes(item.href)
                        ? "bg-slate-800"
                        : "bg-slate-300",
                      "absolute rounded-full h-2 w-2"
                    )}
                    style={{ marginLeft: "-21px" }}
                  ></span>
                  <Icon
                    width={20}
                    height={20}
                    strokeWidth={2.5}
                    className="inline-block stroke-slate-900"
                  />
                  <span
                    className={cn(
                      path === item.href ? "font-bold" : "font-medium",
                      "ml-2 text-slate-800"
                    )}
                  >
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </ul>
        </div>
        <div
          className={cn(
            className,
            "flex items-center border rounded-md border-slate-200 py-3 px-2.5 -ml-2"
          )}
        >
          <div className="rounded-full bg-slate-900 h-10 w-10 flex flex-none items-center justify-center">
            <span className="text-slate-100 font-bold">
              {`${username.slice(0, 1).toUpperCase()}${username.slice(1, 2)}`}
            </span>
          </div>
          <span className="ml-2 text-slate-800 text-ellipsis overflow-hidden">
            {username}
          </span>
          <div
            onClick={() => {
              signOut({
                callbackUrl: "/login",
              });
            }}
            className="ml-auto p-2 hover:cursor-pointer hover:bg-slate-100 hover:rounded"
          >
            <Icons.logout className="h-5 w-5 text-slate-800 hover:text-slate-600" />
          </div>
        </div>
      </div>
      <div className="flex">
        <div className="ml-2.5 h-24 w-0.5 bg-slate-300 rounded-full"></div>
        <ul role="list" className="mt-1"></ul>
      </div>
    </>
  );
};

export default BottomSection;
