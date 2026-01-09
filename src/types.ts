export interface Task {
  id: string;
  title: string;
  status: string;
  do_date: string | null;
  objective_name: string | null;
  objective_deadline: string | null;
}
