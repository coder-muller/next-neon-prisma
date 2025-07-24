"use client"

import { ModeToggle } from "@/components/mode-toggle";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuSeparator } from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Book, ChevronLeft, ChevronRight, EllipsisVertical, Pencil, Plus, Search, Trash } from "lucide-react";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

const formSchema = z.object({
  title: z.string().min(1),
  author: z.string().min(1),
});

type FormData = z.infer<typeof formSchema>;
interface Book {
  id: string;
  title: string;
  author: string;
}

export default function Home() {

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      author: "",
    },
  });

  const [selectedBook, setSelectedBook] = useState<Book | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const onSubmit = (data: FormData) => {
    console.log(data);
  };

  const handleEditBook = (book: Book) => {
    setSelectedBook(book);
    form.reset({
      title: book.title,
      author: book.author,
    });
    setIsDialogOpen(true);
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

        <div className="flex items-center justify-between gap-2 border border-border p-4 rounded-lg">
          <div className="relative w-full max-w-sm">
            <Search className="w-4 h-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input type="text" placeholder="Pesquisar livro" className="pl-8 w-full" />
          </div>

          <Button variant="default" onClick={() => {
            form.reset({
              title: "",
              author: "",
            });
            setSelectedBook(null);
            setIsDialogOpen(true);
          }}>
            <Plus className="w-4 h-4" />
            <span className="hidden md:block">Novo livro</span>
          </Button>
        </div>

        <div className="flex flex-col gap-4 border border-border p-4 rounded-lg">
          <div className="flex flex-col">
            <h2 className="text-sm font-bold">Todos os livros</h2>
            <h2 className="text-xs text-muted-foreground">
              Total de livros: 100
            </h2>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Autor</TableHead>
                <TableHead className="text-center w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>Livro 1</TableCell>
                <TableCell>Autor 1</TableCell>
                <TableCell className="flex justify-center">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <EllipsisVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem onClick={() => handleEditBook({ id: "1", title: "Livro 1", author: "Autor 1" })}>
                        <Pencil className="w-4 h-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <DropdownMenuItem className="text-destructive" onSelect={(e) => e.preventDefault()}>
                            <Trash className="w-4 h-4 text-destructive" />
                            Excluir
                          </DropdownMenuItem>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Você tem certeza?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Esta ação não pode ser desfeita. Isso excluirá permanentemente o livro.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction>Excluir</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>

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
              <Button variant="outline" size="icon" onClick={() => setPage(page - 1)}>
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground">
                1 de 10
              </span>
              <Button variant="outline" size="icon" onClick={() => setPage(page + 1)}>
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

      </main>


      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Livro</DialogTitle>
            <DialogDescription>
              Adicione um novo livro à biblioteca.
            </DialogDescription>
          </DialogHeader>

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
                <Button type="submit">Salvar</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
