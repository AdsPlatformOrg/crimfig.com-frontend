import {WebsiteAdSlots} from '@/components/console/WebsiteAdSlots';
export default async function Page({params}:{params:Promise<{websiteId:string;slotId:string}>}){const {websiteId,slotId}=await params;return <WebsiteAdSlots websiteId={websiteId} slotId={slotId} mode="detail"/>;}
