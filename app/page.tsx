"use client"

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Book, ChevronLeft, ChevronRight, EllipsisVertical, Pencil, Plus, Search, Trash, Loader2 } from "lucide-react";
import { useState, useMemo, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useBooks, useCreateBook, useUpdateBook, useDeleteBook, Book as BookType } from "@/hooks/useBooks";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  author: z.string().min(1, "Author is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Home() {
  // API Hooks
  const { books, loading: booksLoading, error: booksError, refetch } = useBooks();
  const { createBook, loading: createLoading, error: createError, clearError: clearCreateError } = useCreateBook();
  const { updateBook, loading: updateLoading, error: updateError, clearError: clearUpdateError } = useUpdateBook();
  const { deleteBook, loading: deleteLoading, error: deleteError, clearError: clearDeleteError } = useDeleteBook();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
    },
  });

  const [selectedBook, setSelectedBook] = useState<BookType | null>(null);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [bookToDelete, setBookToDelete] = useState<BookType | null>(null);

  // Filter books based on search
  const filteredBooks = useMemo(() => {
    if (!search) return books;
    return books.filter(book => 
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    );
  }, [books, search]);

  // Paginate filtered books
  const paginatedBooks = useMemo(() => {
    const startIndex = (page - 1) * itemsPerPage;
    return filteredBooks.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredBooks, page, itemsPerPage]);

  const totalPages = Math.ceil(filteredBooks.length / itemsPerPage);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [search, itemsPerPage]);

  const onSubmit = async (data: FormData) => {
    if (selectedBook) {
      // Update existing book
      const result = await updateBook(selectedBook.id, data);
      if (result) {
        setIsDialogOpen(false);
        setSelectedBook(null);
        form.reset();
        refetch();
      }
    } else {
      // Create new book
      const result = await createBook(data);
      if (result) {
        setIsDialogOpen(false);
        form.reset();
        refetch();
      }
    }
  };

  const handleEditBook = (book: BookType) => {
    setSelectedBook(book);
    form.reset({
      title: book.title,
      author: book.author,
    });
    clearUpdateError();
    setIsDialogOpen(true);
  };

  const handleDeleteBook = async (book: BookType) => {
    const success = await deleteBook(book.id);
    if (success) {
      setBookToDelete(null);
      refetch();
    }
  };

  const handleNewBook = () => {
    form.reset({
      title: "",
      author: "",
    });
    setSelectedBook(null);
    clearCreateError();
    setIsDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setSelectedBook(null);
    clearCreateError();
    clearUpdateError();
  };

  return (
    <div className="flex flex-col h-screen overflow-y-auto">

      {/* Header */}
      <header className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center gap-2">
          <Book className="w-6 h-6" />
          <h1 className="text-2xl font-bold">Books App</h1>
        </div>
        <ModeToggle />
      </header>

      {/* Main */}
      <main className="flex-1 flex flex-col gap-4 p-6">

        <div className="flex flex-col">
          <h2 className="text-2xl font-bold">Livros</h2>
          <h2 className="text-sm text-muted-foreground">
            Todos os livros em um só lugar
          </h2>
        </div>

        {/* Global Error Display */}
        {booksError && (
          <Alert variant="destructive">
            <AlertDescription>{booksError}</AlertDescription>
          </Alert>
        )}

        <div className="flex items-center justify-between gap-2 border border-border p-4 rounded-lg">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input 
              type="text" 
              placeholder="Pesquisar livro" 
              className="pl-8 w-full" 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <Button variant="default" onClick={handleNewBook}>
            <Plus className="w-4 h-4" />
            <span className="hidden md:block">Novo livro</span>
          </Button>
        </div>

        <div className="flex flex-col gap-4 border border-border p-4 rounded-lg">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold">Todos os livros</h2>
            <h2 className="text-xs text-muted-foreground">
              Total de livros: {filteredBooks.length}
            </h2>
          </div>

          {booksLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="ml-2">Carregando livros...</span>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Título</TableHead>
                    <TableHead>Autor</TableHead>
                    <TableHead className="text-center w-[100px]">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedBooks.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={3} className="text-center py-8 text-muted-foreground">
                        {search ? "Nenhum livro encontrado para a pesquisa" : "Nenhum livro cadastrado"}
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedBooks.map((book) => (
                      <TableRow key={book.id}>
                        <TableCell>{book.title}</TableCell>
                        <TableCell>{book.author}</TableCell>
                        <TableCell className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <EllipsisVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => handleEditBook(book)}>
                                <Pencil className="w-4 h-4" />
                                Editar
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-destructive" 
                                onSelect={(e) => {
                                  e.preventDefault();
                                  setBookToDelete(book);
                                }}
                              >
                                <Trash className="w-4 h-4 text-destructive" />
                                Excluir
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>

              {filteredBooks.length > 0 && (
                <div className="flex items-center justify-between">
                  <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Itens por página" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10 itens por página</SelectItem>
                      <SelectItem value="20">20 itens por página</SelectItem>
                      <SelectItem value="50">50 itens por página</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center gap-2">
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setPage(page - 1)}
                      disabled={page <= 1}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">
                      {page} de {totalPages || 1}
                    </span>
                    <Button 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setPage(page + 1)}
                      disabled={page >= totalPages}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

      </main>

      {/* Create/Edit Book Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={handleDialogClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedBook ? "Editar Livro" : "Adicionar Livro"}</DialogTitle>
            <DialogDescription>
              {selectedBook ? "Edite as informações do livro." : "Adicione um novo livro à biblioteca."}
            </DialogDescription>
          </DialogHeader>

          {/* Error Display */}
          {(createError || updateError) && (
            <Alert variant="destructive">
              <AlertDescription>{createError || updateError}</AlertDescription>
            </Alert>
          )}

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o título do livro" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Autor</FormLabel>
                    <FormControl>
                      <Input placeholder="Digite o nome do autor" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button type="submit" disabled={createLoading || updateLoading}>
                  {(createLoading || updateLoading) && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                  {selectedBook ? "Atualizar" : "Salvar"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!bookToDelete} onOpenChange={() => setBookToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                       <AlertDialogDescription>
             Esta ação não pode ser desfeita. Isso excluirá permanentemente o livro &quot;{bookToDelete?.title}&quot;.
           </AlertDialogDescription>
          </AlertDialogHeader>
          
          {deleteError && (
            <Alert variant="destructive">
              <AlertDescription>{deleteError}</AlertDescription>
            </Alert>
          )}
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setBookToDelete(null);
              clearDeleteError();
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction 
              onClick={() => bookToDelete && handleDeleteBook(bookToDelete)}
              disabled={deleteLoading}
            >
              {deleteLoading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Excluir
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
