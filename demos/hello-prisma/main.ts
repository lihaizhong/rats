import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // const user = await prisma.user.create({
  //   data: {
  //     name: 'Alice',
  //     email: 'alice@prisma.io'
  //   }
  // })
  // console.log('🎉恭喜你，成功了！', user)

  // const users = await prisma.user.findMany()
  // console.log('🎉恭喜你，成功了！', users)

  // const user = await prisma.user.create({
  //   data: {
  //     name: 'Bob',
  //     email: 'bob@prisma.io',
  //     posts: {
  //       create: [
  //         {
  //           title: 'Hello World',
  //           published: true
  //         },
  //         {
  //           title: 'My second post',
  //           content: 'This is still a draft'
  //         }
  //       ]
  //     }
  //   }
  // })
  // console.log('🎉恭喜你，成功了！', user)

  // const usersWithPosts = await prisma.user.findMany({
  //   include: {
  //     posts: true
  //   }
  // })
  // console.log('🎉恭喜你，成功了！')
  // console.dir(usersWithPosts, { depth: null })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('数据库操作失败', e)
    await prisma.$disconnect()
    process.exit(1)
  })
