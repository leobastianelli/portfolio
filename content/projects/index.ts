import type { ProjectMeta } from "@/lib/content/types";
import greensClub from "./greens-club/meta";
import onefamCommunityPortal from "./onefam-community-portal/meta";
import golfMembershipPlatform from "./golf-membership-platform/meta";
import retEnrollmentSystem from "./ret-enrollment-system/meta";
import purpuraCeniza from "./purpura-ceniza/meta";
import victoriapp from "./victoriapp/meta";
import onefamPlatform from "./onefam-platform/meta";
import pitEngineer from "./pit-engineer/meta";
import acHeadTracking from "./ac-head-tracking/meta";

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
  onefamPlatform,
  purpuraCeniza,
  victoriapp,
  pitEngineer,
  acHeadTracking,
];
