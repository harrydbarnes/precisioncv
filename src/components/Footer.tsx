import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer className="py-8 text-center text-sm text-muted-foreground">
      <div className="flex flex-col items-center gap-2">
        <p>By Harry Barnes</p>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="link" className="h-auto p-0 text-muted-foreground underline">
              Open Sources
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Open Source Credits</DialogTitle>
              <DialogDescription>
                This project uses the following open source libraries:
              </DialogDescription>
            </DialogHeader>
            <ul className="list-disc pl-5 space-y-2 text-sm mt-4">
              <li>
                <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">React</a> - UI Library
              </li>
              <li>
                <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Tailwind CSS</a> - Styling
              </li>
              <li>
                <a href="https://ui.shadcn.com/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">shadcn/ui</a> - Component Library
              </li>
              <li>
                <a href="https://www.framer.com/motion/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Framer Motion</a> - Animations
              </li>
              <li>
                <a href="https://lucide.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Lucide React</a> - Icons
              </li>
              <li>
                <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Vite</a> - Build Tool
              </li>
            </ul>
          </DialogContent>
        </Dialog>
      </div>
    </footer>
  );
};

export default Footer;
