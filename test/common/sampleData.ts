import {
  Admin,
  News,
  PrismaClient,
  School,
  SubscribedNews,
  Subscribtion,
  User,
} from '@prisma/client';

const prisma = new PrismaClient();

/*
  school1 - user1, admin1
  school2 - user1, user2, admin2

  school1 - news1(old), news2, news3
  school2 - news4(old), news5, news6(deleted)
*/
export async function insertSampleData(): Promise<void> {
  await prisma.$connect();

  await prisma.subscribedNews.deleteMany();
  await prisma.news.deleteMany();
  await prisma.subscribtion.deleteMany();
  await prisma.admin.deleteMany();
  await prisma.user.deleteMany();
  await prisma.school.deleteMany();

  const schoolDatas = [
    {
      name: 'school1',
      location: 'local1',
    },
    {
      name: 'school2',
      location: 'local2',
    },
    {
      name: 'school3',
      location: 'local3',
    },
  ];
  const schools: School[] = [];
  for (const school of schoolDatas) {
    schools.push(await prisma.school.create({ data: school }));
  }

  const adminDatas = [
    {
      email: 'admin1@test.dev',
      name: 'admin1',
      schoolId: schools[0].id,
    },
    {
      email: 'admin2@test.dev',
      name: 'admin2',
      schoolId: schools[1].id,
    },
    {
      email: 'admin3@test.dev',
      name: 'admin3',
    },
  ];
  const admins: Admin[] = [];
  for (const admin of adminDatas) {
    admins.push(await prisma.admin.create({ data: admin }));
  }

  const userDatas = [
    {
      email: 'user1@test.dev',
      name: 'user1',
    },
    {
      email: 'user2@test.dev',
      name: 'user2',
    },
  ];
  const users: User[] = [];
  for (const user of userDatas) {
    users.push(await prisma.user.create({ data: user }));
  }

  const subscribtionDatas = [
    {
      userId: users[0].id,
      schoolId: schools[0].id,
    },
    {
      userId: users[0].id,
      schoolId: schools[1].id,
    },
    {
      userId: users[1].id,
      schoolId: schools[1].id,
    },
  ];
  const subscribtions: Subscribtion[] = [];
  for (const subscribtion of subscribtionDatas) {
    subscribtions.push(
      await prisma.subscribtion.create({ data: subscribtion }),
    );
  }

  const newsDatas = [
    {
      title: 'news1',
      content: 'school1 news1',
      schoolId: schools[0].id,
      createdAt: new Date('1900-01-01'),
      updatedAt: new Date('1900-01-01'),
    },
    {
      title: 'news2',
      content: 'school1 news2',
      schoolId: schools[0].id,
      createdAt: new Date('2100-01-02'),
      updatedAt: new Date('2100-01-02'),
    },
    {
      title: 'news3',
      content: 'school1 news3',
      schoolId: schools[0].id,
      createdAt: new Date('2100-01-01'),
      updatedAt: new Date('2100-01-01'),
    },
    {
      title: 'news4',
      content: 'school2 news4',
      schoolId: schools[1].id,
      createdAt: new Date('1900-01-04'),
      updatedAt: new Date('1900-01-04'),
    },
    {
      title: 'news5',
      content: 'school2 news5',
      schoolId: schools[1].id,
      createdAt: new Date('2100-01-03'),
      updatedAt: new Date('2100-01-03'),
    },
    {
      title: 'news6',
      content: 'school2 news6',
      schoolId: schools[1].id,
      createdAt: new Date('2099-01-01'),
      updatedAt: new Date('2099-01-01'),
      deletedAt: new Date('2099-01-01'),
    },
  ];
  const newsList: News[] = [];
  for (const news of newsDatas) {
    newsList.push(await prisma.news.create({ data: news }));
  }

  const subscribedNewsDatas = [
    {
      userId: users[0].id,
      newsId: newsList[1].id,
      createdAt: newsList[1].createdAt,
      deletedAt: newsList[1].deletedAt || undefined,
    },
    {
      userId: users[0].id,
      newsId: newsList[2].id,
      createdAt: newsList[2].createdAt,
      deletedAt: newsList[2].deletedAt || undefined,
    },
    {
      userId: users[0].id,
      newsId: newsList[4].id,
      createdAt: newsList[4].createdAt,
      deletedAt: newsList[4].deletedAt || undefined,
    },
    {
      userId: users[0].id,
      newsId: newsList[5].id,
      createdAt: newsList[5].createdAt,
      deletedAt: newsList[5].deletedAt || undefined,
    },
    {
      userId: users[1].id,
      newsId: newsList[4].id,
      createdAt: newsList[4].createdAt,
      deletedAt: newsList[4].deletedAt || undefined,
    },
    {
      userId: users[1].id,
      newsId: newsList[5].id,
      createdAt: newsList[5].createdAt,
      deletedAt: newsList[5].deletedAt || undefined,
    },
  ];
  const subscribedNewsList: SubscribedNews[] = [];
  for (const subscribedNews of subscribedNewsDatas) {
    subscribedNewsList.push(
      await prisma.subscribedNews.create({ data: subscribedNews }),
    );
  }

  await prisma.$disconnect();
}

if (process.argv[2] === 'run') insertSampleData();
