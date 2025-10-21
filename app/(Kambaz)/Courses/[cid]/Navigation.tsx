"use client"
import Link from "next/link";
import { usePathname } from "next/navigation";

type Props = { cid: string };

export default function CourseNavigation({ cid }: Props) {
  const pathname = usePathname();
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];

  // helper to build href for a link label
  const hrefFor = (label: string) => {
    // People uses a nested path in the original scaffold (/People/Table)
    if (label === "People") return `/Courses/${cid}/People/Table`;
    return `/Courses/${cid}/${label}`;
  };

  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((label) => {
        const href = hrefFor(label);
        const isActive = pathname?.startsWith(href) || pathname?.endsWith(`/${label}`);
        const itemClass = `list-group-item border-0 ${isActive ? "active" : "text-danger"}`;
        // give stable ids for tests/anchors
        const id = `wd-course-${label.toLowerCase()}-link`;
        return (
          <Link key={label} href={href} id={id} className={itemClass}>
            {label}
          </Link>
        );
      })}
    </div>
  );
}