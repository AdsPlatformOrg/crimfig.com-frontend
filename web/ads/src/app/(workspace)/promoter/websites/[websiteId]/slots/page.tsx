import {WebsiteAdSlots} from '@/components/console/WebsiteAdSlots';
export default async function Page({params}:{params:Promise<{websiteId:string}>}){const {websiteId}=await params;return <WebsiteAdSlots websiteId={websiteId}/>;}
