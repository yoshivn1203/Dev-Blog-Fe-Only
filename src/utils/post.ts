export const generateFilename = (title: string, date?: Date) => {
  const currentDate = date || new Date()
  const year = currentDate.getFullYear()
  const month = String(currentDate.getMonth() + 1).padStart(2, '0')
  const day = String(currentDate.getDate()).padStart(2, '0')

  // Convert title to URL-friendly format
  const slug = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')

  return `${year}-${month}-${day}-${slug}`
}
