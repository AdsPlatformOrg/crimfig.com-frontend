import catalog from '../data/house-samples.json';
export const HOUSE_SAMPLE_FAMILIES=[
  {id:'sample_04_plaid_man',name:'Plaid man'},
  {id:'sample_03_plaid_woman',name:'Plaid woman'},
  {id:'sample_01_red_turtleneck_growth',name:'Red turtleneck growth'},
] as const;
export const houseSampleCatalog=catalog;
export function fittingSamples(family:string,allowedPresets:readonly string[]=[],width=970,height=600){
  if(!Number.isFinite(width)||!Number.isFinite(height)||width<=0||height<=0)return [];
  return catalog.assets.filter(asset=>asset.family===family&&(!allowedPresets.length||allowedPresets.includes(asset.preset))&&asset.width<=width&&asset.height<=height);
}
