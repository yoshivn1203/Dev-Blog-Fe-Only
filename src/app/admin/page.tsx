'use client'

import { Pencil, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'

import { getPosts } from '@/app/(home)/actions'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'

export default function PostsList() {
  const router = useRouter()
  const [posts, setPosts] = React.useState<any[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false)
  const [postToDelete, setPostToDelete] = React.useState<{ slug: string; title: string } | null>(
    null
  )

  React.useEffect(() => {
    const loadPosts = async () => {
      try {
        const postsList = await getPosts()
        setPosts(postsList)
      } catch (error) {
        console.error('Error loading posts:', error)
        alert('Failed to load posts')
      } finally {
        setIsLoading(false)
      }
    }

    loadPosts()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleDelete = async () => {
    if (!postToDelete) return

    try {
      const response = await fetch('/api/delete-post', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ slug: postToDelete.slug })
      })

      if (!response.ok) {
        throw new Error('Failed to delete post')
      }

      // Refresh the posts list
      const postsList = await getPosts()
      setPosts(postsList)
      setDeleteDialogOpen(false)
      setPostToDelete(null)
    } catch (error) {
      console.error('Error deleting post:', error)
      alert('Failed to delete post')
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-6'>
      <h1 className='text-2xl font-bold'>Admin Dashboard</h1>

      <div className='flex justify-between items-center'>
        <h2 className='text-xl font-bold'>Posts</h2>
        <Button onClick={() => router.push('/admin/new')}>
          <Plus className='mr-2 h-4 w-4' />
          New Post
        </Button>
      </div>
      <div className='border rounded-lg overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='min-w-[200px]'>Title</TableHead>
              <TableHead className='min-w-[150px]'>Date</TableHead>
              <TableHead className='min-w-[200px]'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map(post => (
              <TableRow key={post.slug}>
                <TableCell className='font-medium min-w-[200px]'>{post.title}</TableCell>
                <TableCell className='min-w-[150px]'>{formatDate(post.date)}</TableCell>
                <TableCell className='min-w-[200px]'>
                  <div className='flex gap-2'>
                    <Button
                      variant='outline'
                      size='icon'
                      onClick={() => router.push(`/admin/${post.slug}/edit`)}
                      title='Edit post'
                    >
                      <Pencil className='h-4 w-4' />
                    </Button>
                    <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          variant='destructive'
                          size='icon'
                          onClick={() => setPostToDelete({ slug: post.slug, title: post.title })}
                          title='Delete post'
                        >
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Delete Post</DialogTitle>
                          <DialogDescription>
                            Are you sure you want to delete "{postToDelete?.title}"? This action
                            cannot be undone.
                          </DialogDescription>
                        </DialogHeader>
                        <DialogFooter>
                          <Button variant='outline' onClick={() => setDeleteDialogOpen(false)}>
                            Cancel
                          </Button>
                          <Button variant='destructive' onClick={handleDelete}>
                            Delete
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
