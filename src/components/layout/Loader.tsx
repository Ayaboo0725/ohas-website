import { CurlO } from "@/components/ui/Icons";
import { LoaderDone } from "@/components/layout/LoaderDone";

/**
 * Opening mark: the "O" of OHAS drawn as a croissant curl, then "HAS".
 * Pure CSS so it runs before JavaScript and always clears itself (< 2 s).
 * Skipped on repeat visits in the same session and for reduced motion.
 */
export function Loader() {
  return (
    <div className="loader" aria-hidden="true">
      <div className="loader-mark">
        <CurlO className="loader-o" />
        <span className="loader-letters">
          <span>H</span>
          <span>A</span>
          <span>S</span>
        </span>
      </div>
      <LoaderDone />
    </div>
  );
}
