const { test, describe } = require('node:test')
const assert = require('node:assert')

const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/dijkstra-1',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'https://example.com/dijkstra-2',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'https://example.com/martin-1',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'https://example.com/martin-2',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'https://example.com/martin-3',
    likes: 2,
    __v: 0
  }
]

test('dummy returns one', () => {
  assert.strictEqual(listHelper.dummy(blogs), 1)
})

describe('total likes', () => {
  test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
  })

  test('when list has one blog, equals that blog likes', () => {
    const oneBlog = [blogs[0]]

    assert.strictEqual(
      listHelper.totalLikes(oneBlog),
      7
    )
  })

  test('of a bigger list is calculated correctly', () => {
    assert.strictEqual(
      listHelper.totalLikes(blogs),
      36
    )
  })
})

describe('favorite blog', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.favoriteBlog([]), null)
  })

  test('returns the blog with most likes', () => {
    assert.deepStrictEqual(
      listHelper.favoriteBlog(blogs),
      blogs[2]
    )
  })
})

describe('author with most blogs', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostBlogs([]), null)
  })

  test('returns author with the largest blog count', () => {
    assert.deepStrictEqual(
      listHelper.mostBlogs(blogs),
      {
        author: 'Robert C. Martin',
        blogs: 3
      }
    )
  })
})

describe('author with most likes', () => {
  test('of empty list is null', () => {
    assert.strictEqual(listHelper.mostLikes([]), null)
  })

  test('returns author with the greatest total likes', () => {
    assert.deepStrictEqual(
      listHelper.mostLikes(blogs),
      {
        author: 'Edsger W. Dijkstra',
        likes: 17
      }
    )
  })
})