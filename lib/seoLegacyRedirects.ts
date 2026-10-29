/**
 * Permanent redirects for known URLs from the old mmsweden.se website.
 *
 * Keep this mapping explicit: redirecting every unknown URL to the homepage
 * would create soft-404s and can discard the value of existing backlinks.
 * Additional historical URLs should be added after checking Search Console
 * and the site's backlinks for the appropriate live destination.
 *
 * The function is dependency-free so it can be tested without Next.js.
 */
const LEGACY_PATHS: Record<string, string> = {
  '/index.html': '/sv',
  '/engelska.html': '/en',
  '/nyinkommit.html': '/sv/new-arrivals',
  '/begagnade-maskiner1.html': '/sv/all-products',
  '/bakery-machinery': '/sv/all-products/bakery-machinery',
  '/fish-processing-machinery': '/sv/all-products/fish-processing-machinery',
};

/**
 * Pages from the earlier version of this Next.js website that could be
 * reached without a locale. Historically these received a temporary 307 to
 * the English equivalent. Old Swedish-facing search results instead need a
 * permanent 301 to the Swedish version.
 *
 * Product/category slugs are intentionally preserved. A real missing slug
 * must still return 404 at the destination instead of a fake product page.
 */
const UNPREFIXED_SWEDISH_PAGES = new Set([
  '/all-products',
  '/new-arrivals',
  '/about-us',
  '/contact-us',
  '/sell-to-us',
  '/privacy-policy',
  '/my-price-quote',
]);

/** 156 old product addresses, verified against the 2026-10-29 export. */
const RENAMED_PRODUCT_PATHS: Record<string, string> = {
  '/all-products/bakery-machinery/bakery-conveyors/flour-duster':
    '/all-products/bakery-machinery/bakery-conveyors/bakery-flour-dusting-conveyor-127-cm-belt',
  '/all-products/bakery-machinery/dough-mixers/maren-100f':
    '/all-products/bakery-machinery/dough-mixers/maren-100-f-dough-mixer-with-two-bowls',
  '/all-products/dairy-processing-equipment/storage-tanks/milk-tank':
    '/all-products/dairy-processing-equipment/storage-tanks/milk-cooling-tank-with-agitator-1870-l',
  '/all-products/dairy-processing-equipment/storage-tanks/silo-mixer':
    '/all-products/dairy-processing-equipment/storage-tanks/liquid-mixing-silo-approximately-300-l',
  '/all-products/dairy-processing-equipment/storage-tanks/tank-125-lit':
    '/all-products/dairy-processing-equipment/storage-tanks/stainless-steel-tank-125-l',
  '/all-products/dairy-processing-equipment/storage-tanks/tank-180-lit':
    '/all-products/dairy-processing-equipment/storage-tanks/stainless-steel-tank-180-l',
  '/all-products/dairy-processing-equipment/storage-tanks/tank-500-lit':
    '/all-products/dairy-processing-equipment/storage-tanks/stainless-steel-storage-tank-500-l',
  '/all-products/dairy-processing-equipment/storage-tanks/tank-80-lit':
    '/all-products/dairy-processing-equipment/storage-tanks/stainless-steel-storage-tank-80-l',
  '/all-products/fish-processing-machinery/fish-skinning-machines/baader-185':
    '/all-products/fish-processing-machinery/fish-skinning-machines/baader-185-whitefish-filleting-and-skinning-machine',
  '/all-products/fish-processing-machinery/fish-skinning-machines/grasselli-t30-f':
    '/all-products/fish-processing-machinery/fish-skinning-machines/grasselli-t30-f-fish-skinning-machine-1998',
  '/all-products/fish-processing-machinery/fish-skinning-machines/grasselli-t30-f-1':
    '/all-products/fish-processing-machinery/fish-skinning-machines/grasselli-t30-f-fish-skinning-machine-2000',
  '/all-products/fish-processing-machinery/fish-skinning-machines/grasselli-t30-f-2':
    '/all-products/fish-processing-machinery/fish-skinning-machines/grasselli-t30-f-fish-skinning-machine-30-cm-roller',
  '/all-products/fish-processing-machinery/fish-slicers/arenco-sl':
    '/all-products/fish-processing-machinery/fish-slicers/arenco-sl-portioning-machine-for-fish-fillets',
  '/all-products/food-processing-equipment/bucket-elevators/edmo-lift-tcr-500':
    '/all-products/food-processing-equipment/bucket-elevators/edmo-lift-tcr-500-lifting-table-500-kg-2011',
  '/all-products/food-processing-equipment/bucket-elevators/kg-lift':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-bin-lift-tip-height-approximately-155-cm',
  '/all-products/food-processing-equipment/bucket-elevators/kg-lift-1':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-lift-with-safety-cage-tip-height-34-m',
  '/all-products/food-processing-equipment/bucket-elevators/kg-lift-2':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-lift-for-double-buggies-tip-height-43-m',
  '/all-products/food-processing-equipment/bucket-elevators/kg-lift-3':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-pneumatic-lift-for-plastic-bins',
  '/all-products/food-processing-equipment/bucket-elevators/meat-bin-lifter':
    '/all-products/food-processing-equipment/bucket-elevators/hydraulic-meat-bin-lifter-tipping-height-120-cm',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-pneumatic-container-lift',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-1':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-buggy-lift',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-2':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-mobile-buggy-lift',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-3298-1':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-meat-bin-lifter-tip-height-222-cm',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-3309-1':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-200-l-meat-bin-lifter-lift-height-250-cm',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-3311-1':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-mobile-meat-bin-lifter-lift-height-130-cm',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-4':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-side-trolley-lift-with-safety-cage',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-lift':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-lift-with-safety-cage-3-m-tipping-height',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-skv':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-skv-trolley-lift-with-safety-cage-2019',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-skv-200-mkrt':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-skv-200-mkrt-motorized-meat-bin-lifter',
  '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-skv200-mk':
    '/all-products/food-processing-equipment/bucket-elevators/nimo-kg-skv-200-mk-lifter-for-200-l-meat-bins',
  '/all-products/food-processing-equipment/conveyor-belts/cabinplant':
    '/all-products/food-processing-equipment/conveyor-belts/cabinplant-transport-conveyor-belt-200-x-40-x-115-cm',
  '/all-products/food-processing-equipment/conveyor-belts/cabinplant-1':
    '/all-products/food-processing-equipment/conveyor-belts/cabinplant-transport-conveyor-belt-620-x-65-x-90-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-with-drum-motor-180-x-80-x-110-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-1':
    '/all-products/food-processing-equipment/conveyor-belts/enp-conveyor-belt-with-drum-motor-210-x-80-x-110-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-1776336594196':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-with-buffer-section-360-x-115-x-210-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-1780409586774':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-200-x-85-x-75-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-with-variable-speed-drive-on-wheels-350-x-60-x-160-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-1':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-with-intralox-belt-on-wheels-300-x-55-x-77-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-2':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-with-intralox-belt-on-wheels-190-x-80-x-90-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-3':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-210-x-43-x-87-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-4':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-with-intralox-belt-on-wheels-640-x-53-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-5':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-with-variable-speed-drive-on-wheels',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-6':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-with-intralox-belt-275-x-55-x-75-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-7':
    '/all-products/food-processing-equipment/conveyor-belts/conveyor-belt-with-intralox-belt-340-x-70-x-105-cm',
  '/all-products/food-processing-equipment/conveyor-belts/conveyorbelt':
    '/all-products/food-processing-equipment/conveyor-belts/large-stainless-steel-intralox-conveyor-100-cm-belt',
  '/all-products/food-processing-equipment/conveyor-belts/dishwaher-conveyor':
    '/all-products/food-processing-equipment/conveyor-belts/dishwasher-roller-conveyor-51-cm-width',
  '/all-products/food-processing-equipment/conveyor-belts/enp-conveyor':
    '/all-products/food-processing-equipment/conveyor-belts/enp-mobile-conveyor-belt-with-drum-motor-50-cm-belt',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-sew-motor-600-x-80-x-40-cm',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-1':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-drum-motor-320-x-90-x-50-cm',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-sew-motor-600-x-80-x-40-cm-1',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-1':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-drum-motor-320-x-85-x-50-cm',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-2':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-sew-motor-225-x-90-x-60-cm',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-3':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-drum-motor-320-x-90-x-50-cm-1',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-4':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-drum-motor-320-x-90-x-50-cm-2',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-5':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-drum-motor-320-x-90-x-50-cm-3',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-6':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-sew-motor',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-7':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-sew-motor-230-x-85-x-60-cm',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-8':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-sew-motor-225-x-85-x-60-cm',
  '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-9':
    '/all-products/food-processing-equipment/conveyor-belts/inter-system-conveyor-belt-with-sew-motor-170-x-85-x-60-cm',
  '/all-products/food-processing-equipment/conveyor-belts/mesh-belt':
    '/all-products/food-processing-equipment/conveyor-belts/mobile-mesh-belt-conveyor-with-adjustable-tilt-and-cleaning-system',
  '/all-products/food-processing-equipment/conveyor-belts/nylon-conveyor-belt':
    '/all-products/food-processing-equipment/conveyor-belts/plastic-belt-conveyor-370-x-65-x-80-cm',
  '/all-products/food-processing-equipment/conveyor-belts/nylon-conveyor-belt-1':
    '/all-products/food-processing-equipment/conveyor-belts/plastic-belt-conveyor-275-x-75-x-75-cm',
  '/all-products/food-processing-equipment/food-grade-containers/sinks':
    '/all-products/food-processing-equipment/food-grade-containers/two-stainless-steel-sinks-for-slaughterhouse-use',
  '/all-products/food-processing-equipment/food-grade-containers/stainless-steel-cabinet':
    '/all-products/food-processing-equipment/food-grade-containers/stainless-steel-cabinet-on-wheels-with-four-shelves-198-x-100-x-215-cm',
  '/all-products/food-processing-equipment/food-grade-containers/stainless-steel-cabinet-1772713463650':
    '/all-products/food-processing-equipment/food-grade-containers/stainless-steel-cabinet-with-shelves-126-x-97-x-160-cm',
  '/all-products/food-processing-equipment/food-grade-containers/stainless-steel-locker-1773754243421':
    '/all-products/food-processing-equipment/food-grade-containers/stainless-steel-locker-100-x-50-x-125-cm',
  '/all-products/food-processing-equipment/food-trolleys/label-trolley':
    '/all-products/food-processing-equipment/food-trolleys/stainless-steel-label-holder-trolley-75-x-70-x-120-cm',
  '/all-products/food-processing-equipment/food-trolleys/label-trolley-1':
    '/all-products/food-processing-equipment/food-trolleys/stainless-steel-label-trolley-on-wheels',
  '/all-products/food-processing-equipment/food-trolleys/trolley':
    '/all-products/food-processing-equipment/food-trolleys/stainless-steel-36-shelf-trolley',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/food-processing-cutting-table-with-plastic-boards-and-central-chute-340-x-135-x-95-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-1':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-cutting-table-185-x-117-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-1781182940582':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-cutting-table-with-undershelf-300-x-64-x-88-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-2':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-cutting-table-200-x-105-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-3':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-cutting-table',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-4':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/mobile-4-station-cutting-table-for-meat-and-fish-340-x-135-x-95-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-5':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/large-cutting-table-with-plastic-cutting-boards-300-x-145-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-6':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-with-adjustable-legs-290-x-150-x-80-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-7':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/heavy-duty-cutting-table-80-x-65-x-80-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-8':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-with-adjustable-legs-290-x-150-x-80-cm-1',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/cutting-table-9':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/height-adjustable-cutting-table-with-plastic-boards-290-x-150-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/korvbord':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-sausage-table-with-angled-corner',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/nn-table':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/packing-table-1':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-packing-table-290-x-140-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/packing-table-2':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-packing-table-with-undershelf-265-x-100-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/packing-table-3':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-packing-table-200-x-100-x-85-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/packing-table-5':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-packing-table-with-undershelf-175-x-80-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/platform':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-access-platform-with-aluminium-stairs-180-x-70-x-165-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/platform-1':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-access-platform-on-wheels-140-x-80-x-200-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/platform-1781256649001':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-access-platform-with-plastic-steps-200-x-120-x-195-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/platform-1781256821464':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-access-platform-345-x-110-x-185-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/platform-1782384350066':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-access-platform-230-x-90-x-240-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/sausage-table':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-sausage-table-with-adjustable-feet-180-x-80-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/sausage-table-1':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-sausage-table-with-central-drain-180-x-90-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/sausage-table-1781183197085':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-sausage-table-on-wheels-300-x-136-x-95-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/sausage-table-1781254091673':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-sausage-table-330-x-100-x-98-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/sausage-table-2':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-sausage-table-with-adjustable-height-and-tilt-160-x-110-x-120-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/ss-table':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-132-x-108-x-78-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/ss-table-1':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-with-back-panel-180-x-80-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-table':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-packing-table-150-x-60-x-83-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-table-1779197196023':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-packing-table-with-undershelf-130-x-87-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-table-1779197288113':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-packing-table-140-x-65-x-85-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-table-1780997828627':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-with-undershelf-286-x-86-x-87-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-table-1781002538562':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-with-undershelf-241-x-65-x-91-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-table-1781254348718':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-296-x-138-x-78-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-table':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-with-undershelf-60-x-50-x-62-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/table':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/work-table-on-wheels-107-x-75-x-93-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/table-1':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-with-shelf-100-x-70-x-85-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/table-1776262276855':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-with-shelf-170-x-70-x-90-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/table-1776262389316':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-120-x-50-x-85-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/table-2':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-with-shelf-100-x-60-x-87-cm',
  '/all-products/food-processing-equipment/stainless-steel-work-tables/table-3':
    '/all-products/food-processing-equipment/stainless-steel-work-tables/stainless-steel-work-table-for-weighing-station-63-x-52-x-90-cm',
  '/all-products/fruit-vegetable-processing-machinery/fruit-vegetable-dryers/kronen-k-50-4':
    '/all-products/fruit-vegetable-processing-machinery/fruit-vegetable-dryers/kronen-k-50-4-salad-centrifuge-up-to-1200-kgh',
  '/all-products/meat-processing-machinery/breading-equipment/stein-e-14':
    '/all-products/meat-processing-machinery/breading-equipment/stein-e-14-breading-machine-400-mm-belt',
  '/all-products/meat-processing-machinery/breading-equipment/tempura-dipper':
    '/all-products/meat-processing-machinery/breading-equipment/tempura-dipping-conveyor-600-mm-belt-width',
  '/all-products/meat-processing-machinery/forming-machines/abm-f2000-plus':
    '/all-products/meat-processing-machinery/forming-machines/abm-f2000-plus-hamburger-forming-machine-2024',
  '/all-products/meat-processing-machinery/meat-cutters/glass-vas-vsm-1000':
    '/all-products/meat-processing-machinery/meat-cutters/glass-vas-vsm-1000-food-processing-cutter-1000-l-2008',
  '/all-products/meat-processing-machinery/meat-cutters/kilia-65-lit':
    '/all-products/meat-processing-machinery/meat-cutters/kilia-65-l-bowl-cutter',
  '/all-products/meat-processing-machinery/meat-cutters/vemag-tm-203':
    '/all-products/meat-processing-machinery/meat-cutters/vemag-tm-203-sausage-cutter-2008-1200-cutsmin',
  '/all-products/meat-processing-machinery/meat-grinders/pss-sg-200':
    '/all-products/meat-processing-machinery/meat-grinders/pss-sg-200-meat-grinder-2013-4000-8000-kgh',
  '/all-products/meat-processing-machinery/meat-grinders/wolfking-c-160-uni-1':
    '/all-products/meat-processing-machinery/meat-grinders/wolfking-c-160-uni-meat-grinder-with-spare-auger',
  '/all-products/meat-processing-machinery/meat-mixers/lydotec':
    '/all-products/meat-processing-machinery/meat-mixers/lydotec-mixing-tank-approximately-400-l',
  '/all-products/meat-processing-machinery/meat-mixers/mixer':
    '/all-products/meat-processing-machinery/meat-mixers/stainless-steel-tilting-food-mixer',
  '/all-products/meat-processing-machinery/meat-mixers/pss-sm-700-pss-g-250-a':
    '/all-products/meat-processing-machinery/meat-mixers/pss-sm-700-paddle-mixer-g-250-a-screw-conveyor-20142016',
  '/all-products/meat-processing-machinery/meat-mixers/pss-sm-700-pss-g-250-a-1':
    '/all-products/meat-processing-machinery/meat-mixers/pss-sm-700-paddle-mixer-g-250-a-screw-conveyor-2014',
  '/all-products/meat-processing-machinery/meat-mixers/roscher-matic':
    '/all-products/meat-processing-machinery/meat-mixers/roscher-matic-vacuum-ready-mixertumbler-approximately-150-l',
  '/all-products/meat-processing-machinery/meat-slicers/berkel':
    '/all-products/meat-processing-machinery/meat-slicers/berkel-manual-slicer-with-built-in-sharpener',
  '/all-products/meat-processing-machinery/meat-slicers/dixie-union-495-sl':
    '/all-products/meat-processing-machinery/meat-slicers/dixie-union-495-sl-slicer-with-discharge-conveyor-1994',
  '/all-products/meat-processing-machinery/meat-slicers/hallde-rg-100':
    '/all-products/meat-processing-machinery/meat-slicers/hallde-rg-100-vegetable-slicer-2016',
  '/all-products/meat-processing-machinery/meat-slicers/weber-msg-460':
    '/all-products/meat-processing-machinery/meat-slicers/weber-msg-460-circular-blade-sharpener',
  '/all-products/meat-processing-machinery/meat-slicers/weber-msg-460-5':
    '/all-products/meat-processing-machinery/meat-slicers/weber-msg-460-5-circular-blade-sharpener',
  '/all-products/meat-processing-machinery/portioning-machines/bankeryd-os-20':
    '/all-products/meat-processing-machinery/portioning-machines/bankeryd-os-20-cake-and-cheese-slicer-130-x-65-x-120-cm',
  '/all-products/meat-processing-machinery/portioning-machines/bankeryd-os-20-1':
    '/all-products/meat-processing-machinery/portioning-machines/bankeryd-os-20-cake-and-cheese-slicer-140-x-65-x-120-cm',
  '/all-products/meat-processing-machinery/portioning-machines/maja-fps-40':
    '/all-products/meat-processing-machinery/portioning-machines/maja-fps-40-meat-portioning-machine',
  '/all-products/meat-processing-machinery/sausage-casing-machines/olve-industrier':
    '/all-products/meat-processing-machinery/sausage-casing-machines/olve-industrier-twistomatic-2000-casing-twisting-machine',
  '/all-products/meat-processing-machinery/sausage-stuffers-vacuum-fillers/vemag-robby':
    '/all-products/meat-processing-machinery/sausage-stuffers-vacuum-fillers/vemag-robby-vacuum-stuffer-with-linking-and-twisting-unit',
  '/all-products/packaging-machinery/flow-pack-machines/ulma-alaska':
    '/all-products/packaging-machinery/flow-pack-machines/ulma-alaska-flow-wrapper-with-gas-mixer-1999',
  '/all-products/packaging-machinery/thermoforming-machines/multivac-r-240-3303-1':
    '/all-products/packaging-machinery/thermoforming-machines/multivac-r-240-thermoforming-packaging-machine-2005',
  '/all-products/packaging-machinery/thermoforming-machines/multivac-r-530':
    '/all-products/packaging-machinery/thermoforming-machines/multivac-r-530-packaging-machine-2004',
  '/all-products/packaging-machinery/tray-sealers/meca-plastic-meca':
    '/all-products/packaging-machinery/tray-sealers/meca-plastic-tray-sealer-for-vacuummap-packaging-430-x-115-x-160-cm',
  '/all-products/packaging-machinery/tray-sealers/meca-plastic-meca-1':
    '/all-products/packaging-machinery/tray-sealers/meca-plastic-tray-sealer-for-vacuummap-packaging-430-x-100-x-190-cm',
  '/all-products/packaging-machinery/tray-sealers/rotopack-turn':
    '/all-products/packaging-machinery/tray-sealers/rotopack-turn-semi-automatic-vacuummap-tray-sealer',
  '/all-products/packaging-machinery/vacuum-packaging-machines/cvp-a-200':
    '/all-products/packaging-machinery/vacuum-packaging-machines/cvp-a-200-vacuum-packaging-machine-2005',
  '/all-products/packaging-machinery/vacuum-packaging-machines/cvp-a-200-3283-1':
    '/all-products/packaging-machinery/vacuum-packaging-machines/cvp-a-200-bulk-vacuum-packaging-machine-160-x-90-x-190-cm',
  '/all-products/packaging-machinery/vacuum-packaging-machines/cvp-a-200-3285-1':
    '/all-products/packaging-machinery/vacuum-packaging-machines/cvp-a-200-bulk-vacuum-packaging-machine-160-x-95-x-200-cm',
  '/all-products/refrigeration-equipment/vacuum-pumps/rietschle-booster-pump':
    '/all-products/refrigeration-equipment/vacuum-pumps/rietschle-booster-vacuum-pump-250-cc',
  '/all-products/thermal-processing-equipment/industrial-fryers/foodco':
    '/all-products/thermal-processing-equipment/industrial-fryers/foodco-hot-air-tunnel-450-x-140-x-300-cm',
  '/all-products/thermal-processing-equipment/industrial-fryers/fryer':
    '/all-products/thermal-processing-equipment/industrial-fryers/industrial-fryer-1200-750-mm-internal-dimensions',
  '/all-products/thermal-processing-equipment/microwaves/amtek-amt7510u':
    '/all-products/thermal-processing-equipment/microwaves/amtek-amt7510u-industrial-microwaveoven-2010',
  '/all-products/thermal-processing-equipment/microwaves/stalam-rf-20-kw':
    '/all-products/thermal-processing-equipment/microwaves/stalam-rf-20-kw-meat-and-fish-defrosting-oven',
  '/all-products/thermal-processing-equipment/ovens/elektro-termo':
    '/all-products/thermal-processing-equipment/ovens/elektro-termo-electric-cooker-four-hotplates-6-kw',
  '/all-products/thermal-processing-equipment/ovens/knight-oven':
    '/all-products/thermal-processing-equipment/ovens/knight-benchtop-hot-air-oven',
  '/all-products/thermal-processing-equipment/ovens/rational-cm-6':
    '/all-products/thermal-processing-equipment/ovens/rational-cm-6-combi-oven-for-six-gn-containers',
  '/all-products/thermal-processing-equipment/smokehouses/doleschal':
    '/all-products/thermal-processing-equipment/smokehouses/doleschal-um4-3000-k-smoking-and-cooking-cabinet-4-trolleys',
  '/all-products/thermal-processing-equipment/smokehouses/foodco-1773755349596':
    '/all-products/thermal-processing-equipment/smokehouses/foodco-smoke-generator-20-x-90-x-180-cm',
  '/all-products/thermal-processing-equipment/smokehouses/foodco-1776262161499':
    '/all-products/thermal-processing-equipment/smokehouses/foodco-smoke-generator-140-x-90-x-175-cm',
  '/all-products/thermal-processing-equipment/smokehouses/smoke-wagons':
    '/all-products/thermal-processing-equipment/smokehouses/smoking-trolleys-for-bacon',
};

function getRenamedProductDestination(path: string): string | null {
  const localized = path.match(
    /^\/(en|sv|de|fr|es|ru|uk|pl)(\/all-products\/.+)$/i
  );
  if (localized) {
    const newPath = RENAMED_PRODUCT_PATHS[localized[2].toLowerCase()];
    return newPath ? `/${localized[1].toLowerCase()}${newPath}` : null;
  }
  const newPath = RENAMED_PRODUCT_PATHS[path.toLowerCase()];
  return newPath ? `/sv${newPath}` : null;
}

/**
 * Historical pages sometimes linked to `all-products/...` relative to an
 * obsolete `.html` route, producing paths such as
 * `/index.html/all-products/...` or `/de/engelska.html/all-products/...`.
 *
 * Resolve only known page structures. Do NOT redirect every 404 or assets:
 * unknown paths should remain 404 and hashed `_next` resources are not pages.
 */
function getNestedHtmlLegacyDestination(path: string): string | null {
  const matched = path.match(
    /^\/(?:(en|sv|de|fr|es|ru|uk|pl)\/)?(index\.html|engelska\.html|begagnade-maskiner1\.html)(\/.*)?$/i
  );
  if (!matched) return null;

  const [, localeInPath, legacyPage, suffix = ''] = matched;
  const locale =
    localeInPath?.toLowerCase() ||
    (legacyPage.toLowerCase() === 'engelska.html' ? 'en' : 'sv');

  // Root-level legacy documents have an explicit mapping in LEGACY_PATHS.
  if (!suffix) return localeInPath ? `/${locale}` : null;

  const staticPages = new Set([
    '/about-us',
    '/contact-us',
    '/sell-to-us',
    '/new-arrivals',
    '/privacy-policy',
    '/my-price-quote',
  ]);
  const validSuffix =
    suffix === '/all-products' ||
    suffix.startsWith('/all-products/') ||
    staticPages.has(suffix.toLowerCase());
  if (!validSuffix) return null;

  const localizedPath = `/${locale}${suffix}`;
  // Combine with the 156 existing product-rename redirects in one hop.
  return getRenamedProductDestination(localizedPath) || localizedPath;
}

function getLegacyDestination(path: string): string | null {
  const nestedHtml = getNestedHtmlLegacyDestination(path);
  if (nestedHtml) return nestedHtml;

  const renamed = getRenamedProductDestination(path);
  if (renamed) return renamed;

  const normalizedPath = path.toLowerCase();
  const knownLegacyPath = LEGACY_PATHS[normalizedPath];
  if (knownLegacyPath) return knownLegacyPath;

  if (
    UNPREFIXED_SWEDISH_PAGES.has(normalizedPath) ||
    normalizedPath.startsWith('/all-products/')
  ) {
    return `/sv${path}`;
  }

  // Keep the site's global landing page in English. The historical Swedish
  // category pages above redirect straight to their Swedish destinations.
  if (path === '/') return '/en';

  return null;
}

export function getSeoRedirectTarget(url: URL, hostname: string): URL | null {
  const incomingHost = hostname.split(':')[0].toLowerCase();
  const isBareDomain = incomingHost === 'mmsweden.se';
  const isCanonicalDomain = incomingHost === 'www.mmsweden.se';
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const destination = getLegacyDestination(path);

  if (!isBareDomain && !destination) return null;

  const target = new URL(url);

  if (isBareDomain || isCanonicalDomain) {
    target.protocol = 'https:';
    target.hostname = 'www.mmsweden.se';
    // Remove a reverse proxy's internal port from production redirects.
    target.port = '';
  }

  if (destination) target.pathname = destination;

  // Preserve original query parameters (UTM tags, filters and pagination).
  return target;
}
