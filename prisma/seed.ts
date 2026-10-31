import {PrismaClient} from '@prisma/client';
import {generateDatabase} from '../lib/engine';
const prisma=new PrismaClient();
async function main(){const d=generateDatabase();
 await prisma.$transaction([prisma.recommendation.deleteMany(),prisma.renewal.deleteMany(),prisma.subscription.deleteMany(),prisma.supportCase.deleteMany(),prisma.activity.deleteMany(),prisma.contact.deleteMany(),prisma.opportunity.deleteMany(),prisma.campaign.deleteMany(),prisma.account.deleteMany()]);
 for(const a of d.accounts){await prisma.account.create({data:{id:a.id,name:a.name,industry:a.industry,segment:a.segment,owner:a.owner,arr:a.arr,renewalDays:a.renewalDays,usageChange:a.usageChange,engagement:a.engagement,supportCritical:a.supportCritical,paymentLate:a.paymentLate,stakeholderActive:a.stakeholderActive,csat:a.csat,seatUtilization:a.seatUtilization,health:a.health}})}
 await prisma.contact.createMany({data:d.contacts});await prisma.opportunity.createMany({data:d.opportunities});await prisma.activity.createMany({data:d.activities});await prisma.supportCase.createMany({data:d.cases});await prisma.campaign.createMany({data:d.campaigns});await prisma.subscription.createMany({data:d.subscriptions});await prisma.renewal.createMany({data:d.renewals});
 console.log(`Seeded ${d.accounts.length} accounts, ${d.opportunities.length} opportunities and related objects`);
}
main().finally(()=>prisma.$disconnect());
