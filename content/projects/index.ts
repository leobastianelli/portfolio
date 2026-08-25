import type { ProjectMeta } from "@/lib/content/types";
import greensClub from "./greens-club/meta";
import onefamCommunityPortal from "./onefam-community-portal/meta";
import golfMembershipPlatform from "./golf-membership-platform/meta";
import retEnrollmentSystem from "./ret-enrollment-system/meta";
import armadorDeApuntes from "./armador-de-apuntes/meta";
import scout from "./scout/meta";
import purpuraCeniza from "./purpura-ceniza/meta";

/**
 * Explicit registry rather than a directory scan: Next.js bundles these
 * statically, and a fixed list keeps project order deliberate (featured
 * first, in the order they should render).
 */
export const projectMetas: ProjectMeta[] = [
  greensClub,
  onefamCommunityPortal,
  golfMembershipPlatform,
  retEnrollmentSystem,
  armadorDeApuntes,
  scout,
  purpuraCeniza,
];
