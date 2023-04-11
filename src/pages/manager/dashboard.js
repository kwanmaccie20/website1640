import AppLayout from "@/layouts/AppLayout";
import React from "react";
import { TagCloud } from "react-tagcloud";
import { Bar } from "react-chartjs-2";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import {
  createStyles,
  Group,
  Paper,
  SimpleGrid,
  Text,
  rem,
  Center,
  Stack,
} from "@mantine/core";
import { useState } from "react";
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
const useStyles = createStyles((theme) => ({
  root: {
    padding: `calc(${theme.spacing.xl} * 1.5)`,
  },

  value: {
    fontSize: rem(24),
    fontWeight: 700,
    lineHeight: 1,
  },

  diff: {
    lineHeight: 1,
    display: "flex",
    alignItems: "center",
  },

  icon: {
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[3]
        : theme.colors.gray[4],
  },

  title: {
    fontWeight: 700,
    textTransform: "uppercase",
  },
}));

const icons = {
  user: IconUserPlus,
  discount: IconDiscount2,
  receipt: IconReceipt2,
  coin: IconCoin,
};

export default function Dashboard() {
  const [topIdea, setTopIdea] = useState([]);
  const [topView, setTopView] = useState([]);
  const [ideaCount, setIdeaCount] = useState(0);
  const [staffCount, setStaffCount] = useState(0);
  const [departmentCount, setDepartmentCount] = useState(0);
  const [tags, setTags] = useState([]);
  const supabase = useSupabaseClient();
  const getTopView = async () => {
    const { data, error } = await supabase
      .from("ideas")
      .select("id, title, views")
      .order("views", { ascending: false })
      .limit(10);
    try {
      console.log("VIEW", data);
      setTopView(data);
    } catch {
      console.log(error);
    }
  };
  const getTopIdea = async () => {
    const { data, error } = await supabase
      .from("ideas")
      .select("id, title, ranking_score")
      .order("ranking_score", { ascending: false })
      .limit(10);
    try {
      console.log(data);
      setTopIdea(data);
    } catch {
      console.log(error);
    }
  };
  const getDepartmentCount = async () => {
    const { data, error, count } = await supabase
      .from("departments")
      .select("id", { count: "exact" });
    try {
      setDepartmentCount(count);
    } catch {
      console.log("ERROR", error);
    }
  };
  const getStaffCount = async () => {
    const { data, error, count } = await supabase
      .from("staff")
      .select("id", { count: "exact" });
    try {
      setStaffCount(count);
    } catch {
      console.log("ERROR", error);
    }
  };
  const getIdeaCount = async () => {
    const { data, error, count } = await supabase
      .from("ideas")
      .select("id", { count: "exact" });
    try {
      console.log(count);
      setIdeaCount(count);
    } catch {
      console.log("ERROR", error);
    }
  };
  const getForWordCloud = async () => {
    const { data, error } = await supabase
      .rpc("count_ideas_all_tag")
      .select("*");
    try {
      setTags(data.map((val) => ({ value: val.name, count: val.idea_count })));
      console.log(data);
    } catch (err) {
      console.log(error);
    }
  };
  useEffect(() => {
    getForWordCloud();
    getDepartmentCount();
    getIdeaCount();
    getStaffCount();
    getTopIdea();
    getTopView();
  }, []);

  const options = {
    luminosity: "dark",
    hue: "blue",
    shuffle: true,
  };
  const data = [
    {
      title: "IDEAS",
      icon: "receipt",
      value: ideaCount,
      diff: "ideas in the system",
    },
    {
      title: "STAFF",
      icon: "coin",
      value: staffCount,
      diff: "in university",
    },
    {
      title: "DEPARTMENT",
      icon: "discount",
      value: departmentCount,
      diff: "in company",
    },
    {
      title: "New customers",
      icon: "user",
      value: "188",
      diff: -30,
    },
  ];
  const { classes } = useStyles();
  const stats = data.map((stat) => {
    const Icon = icons[stat.icon];
    const DiffIcon = stat.diff > 0 ? IconArrowUpRight : IconArrowDownRight;

    return (
      <Paper withBorder p="md" radius="md" key={stat.title}>
        <Group position="apart">
          <Text size="xs" color="dimmed" className={classes.title}>
            {stat.title}
          </Text>
          <Icon className={classes.icon} size="1.4rem" stroke={1.5} />
        </Group>

        <Group align="flex-end" spacing="xs" mt={25}>
          <Text className={classes.value}>{stat.value}</Text>
        </Group>

        <Text fz="xs" c="dimmed" mt={7}>
          {stat.diff}
        </Text>
      </Paper>
    );
  });
  return (
    <div className={classes.root}>
      <SimpleGrid
        cols={4}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>

      <Stack>
        <div className="">
          <h2 className="text-2xl font-bold mb-4">Bar Chart</h2>
          <Chart data={topIdea} />
        </div>
        <div className="">
          <h2 className="text-2xl font-bold mb-4">Bar Chart</h2>
          <ChartOfView data={topView} />
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Popular Tags</h2>
          <div className="bg-gray-20 p-4 rounded-lg shadow-md ">
            <Center>
              <TagCloud
                tags={tags}
                minSize={25}
                maxSize={65}
                colorOptions={options}
              />
            </Center>
          </div>
        </div>
      </Stack>
    </div>
  );
}

Dashboard.getLayout = function getLayout(page) {
  return <AppLayout>{page}</AppLayout>;
};

export async function getStaticProps(ctx) {
  return {
    props: {
      title: "Dashboard",
    },
  };
}
export function log(title = "LOG", message) {
  console.log(title + " - ", message);
}

// export const BarChartImplement = ({ chartData }) => {
//   // Extract the title and value from the data array
//   const titles = chartData.map((item) => item.title);
//   const values = chartData.map((item) => item.value);

//   // Define the chart data
//   const data = {
//     labels: titles,
//     datasets: [
//       {
//         label: "My First Dataset",
//         data: values,
//         backgroundColor: [
//           "rgba(255, 99, 132, 0.2)",
//           "rgba(255, 159, 64, 0.2)",
//           "rgba(255, 205, 86, 0.2)",
//           "rgba(75, 192, 192, 0.2)",
//           "rgba(54, 162, 235, 0.2)",
//           "rgba(153, 102, 255, 0.2)",
//           "rgba(201, 203, 207, 0.2)",
//         ],
//         borderColor: [
//           "rgb(255, 99, 132)",
//           "rgb(255, 159, 64)",
//           "rgb(255, 205, 86)",
//           "rgb(75, 192, 192)",
//           "rgb(54, 162, 235)",
//           "rgb(153, 102, 255)",
//           "rgb(201, 203, 207)",
//         ],
//         borderWidth: 1,
//       },
//     ],
//   };

//   const config = {
//     type: "bar",
//     data: data,
//     options: {
//       scales: {
//         y: {
//           beginAtZero: true,
//         },
//       },
//     },
//   };
//   // Create a new chart object

//   return (
//     <div style={{ height: "400px", width: "400px" }}>
//       {new BarChart(document.getElementById("chartjs"), { ...config })}
//       <canvas id="chartjs" />
//     </div>
//   );
// };

const Chart = ({ data }) => {
  // format the data for the chart
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const lables = data.map((item) => item.title);
  log(null, lables);
  const chartData = {
    labels: lables,
    datasets: [
      {
        label: "Ranking Score",
        data: data.map((item) => item.ranking_score),
        backgroundColor: "rgba(75,192,192,1)",
      },
    ],
  };

  // options for the chart

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };

  return (
    <Bar
      width={"500px"}
      height={"550px"}
      className=" max-h-[50vh]"
      data={chartData}
      options={options}
    />
  );
};

const ChartOfView = ({ data }) => {
  // format the data for the chart
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  const labels = data.map((item) => item.title);
  log(null, labels);
  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Ranking Score",
        data: data.map((item) => item.views),
        backgroundColor: "rgba(75,192,192,1)",
      },
    ],
  };

  // options for the chart

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Chart.js Bar Chart",
      },
    },
  };

  return (
    <Bar
      width={"500px"}
      height={"550px"}
      className=" max-h-[50vh]"
      data={chartData}
      options={options}
    />
  );
};
