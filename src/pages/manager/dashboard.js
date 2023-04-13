import AppLayout from "@/layouts/AppLayout";
import React from "react";
import { TagCloud } from "react-tagcloud";
import { Bar, getDatasetAtEvent } from "react-chartjs-2";

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
  useMantineTheme,
  px,
} from "@mantine/core";
import { useState } from "react";
import {
  IconUserPlus,
  IconDiscount2,
  IconReceipt2,
  IconCoin,
  IconArrowUpRight,
  IconArrowDownRight,
  IconBulb,
  IconUsers,
  IconHierarchy2,
} from "@tabler/icons-react";
import { useSupabaseClient } from "@supabase/auth-helpers-react";
import { useEffect } from "react";
import theme from "tailwindcss/defaultTheme";
import { modals } from "@mantine/modals";
import IdeaDetail from "@/components/IdeaDetail";
const useStyles = createStyles((theme) => ({
  root: {
    // padding: `calc(${theme.spacing.xl} * 1.5)`,
    padding: "10px 5px",
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
  discount: IconHierarchy2,
  receipt: IconBulb,
  coin: IconUsers,
};

export default function Dashboard() {
  const theme = useMantineTheme();
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
      .select(
        "*, staff!ideas_author_id_fkey(id, first_name, last_name, email), campaigns!inner(*, academic_year(*)), tags(*), idea_documents(*))",
        { count: "exact" }
      )
      .order("views", { ascending: false })
      .limit(10);
    try {
      setTopView(data);
    } catch {
      console.log(error);
    }
  };
  const getTopIdea = async () => {
    const { data, error } = await supabase
      .from("ideas")
      .select(
        "*, staff!ideas_author_id_fkey(id, first_name, last_name, email), campaigns!inner(*, academic_year(*)), tags(*), idea_documents(*))",
        { count: "exact" }
      )
      .order("ranking_score", { ascending: false })
      .limit(10);
    try {
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
    // {
    //   title: "New customers",
    //   icon: "user",
    //   value: "188",
    //   diff: -30,
    // },
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
        cols={3}
        breakpoints={[
          { maxWidth: "md", cols: 2 },
          { maxWidth: "xs", cols: 1 },
        ]}
      >
        {stats}
      </SimpleGrid>

      <Stack>
        <div className="">
          <h2 className="text-2xl font-bold my-4">Top popular ideas</h2>
          <Chart data={topIdea} />
        </div>
        <div className="">
          <h2 className="text-2xl font-bold my-4">Top view ideas</h2>
          <ChartOfView data={topView} />
        </div>

        <div>
          <h2 className="text-2xl font-bold my-4">Popular Tags</h2>
          <div className="bg-gray-20 p-[2px] sm:p-2 md:p-4 rounded-lg shadow-md ">
            <Center>
              <TagCloud
                tags={tags}
                minSize={px("1.5rem")}
                maxSize={px("4rem")}
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

const Chart = ({ data }) => {
  const theme = useMantineTheme();
  // format the data for the chart
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  // const lables = data.map((item) => item.title);
  const labels = data.map((item) =>
    item.title.length < 15 ? item.title : item.title.substring(0, 14) + "..."
  );
  const labels2 = data.map((item) => item.title);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "Ranking Score",
        data: data.map((item) => item.ranking_score),
        backgroundColor: theme.fn.primaryColor(),
      },
    ],
  };

  // options for the chart

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top Popular Ideas",
      },
      tooltip: {
        callbacks: {
          title: (tooltipItem, data) => {
            return (labels2[tooltipItem[0].dataIndex]);
          },
        }
      }
    },
    onClick: (event, active) => {
      if (active.length > 0) {
        const index = active[0].index;
        modals.open({
          title: <strong>{data[index].title}</strong>,
          size: "100%",
          padding: "15px 15px 0 15px",
          children: <IdeaDetail idea={data[index]}/>
        })
        console.log("You clicked on bar", data[index]);
      }
    }
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
  const theme = useMantineTheme();
  // format the data for the chart
  ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );
  // const lables = data.map((item) => item.title);
  const labels = data.map((item) =>
    item.title.length < 15 ? item.title : item.title.substring(0, 14) + "..."
  );
  const labels2 = data.map((item) => item.title);

  const chartData = {
    labels: labels,
    datasets: [
      {
        label: "View Count",
        data: data.map((item) => item.views),
        backgroundColor: theme.fn.primaryColor(),
      },
    ],
  };

  // options for the chart

  const options = {
    indexAxis: "y",
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Top View Ideas",
      },
      tooltip: {
        callbacks: {
          title: (tooltipItem, data) => {
            return (labels2[tooltipItem[0].dataIndex]);
          },
        }
      }
    },
    onClick: (event, active) => {
      if (active.length > 0) {
        const index = active[0].index;
        modals.open({
          title: <strong>{data[index].title}</strong>,
          size: "100%",
          padding: "15px 15px 0 15px",
          children: <IdeaDetail idea={data[index]}/>
        })
        console.log("You clicked on bar", data[index]);
      }
    }
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
