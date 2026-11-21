import catalog from '../data/house-samples.json';
export const HOUSE_SAMPLE_FAMILIES=[
  {id:'sample_04_plaid_man',name:'Sample Ad #1'},
  {id:'sample_03_plaid_woman',name:'Sample Ad #2'},
  {id:'sample_01_red_turtleneck_growth',name:'Sample Ad #3'},
] as const;
export const houseSampleCatalog=catalog;
export function fittingSamples(family:string,allowedPresets:readonly string[]=[],width=970,height=600){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return [];
  return catalog.assets.filter(asset=>asset.family===family&&(!allowedPresets.length||allowedPresets.includes(asset.preset))&&asset.width<=width&&asset.height<=height);
}
