require 'date'
require 'time'
require 'html-proofer'
require 'rake'
require 'json'
require 'front_matter_parser'
require 'open3'

class String
  def titlecase
    split(/([[:alpha:]]+)/).map(&:capitalize).join
  end
end

desc "Run travis tests"
task :test_travis do
  options = {
      :assume_extension => true,
      :empty_alt_ignore => true,
      :http_status_ignore => [0, 301, 404, 403, 410, 500, 503],
      :alt_ignore => ['/.*/'],
      :internal_domains => ['localhost:4000']
  }

  HTMLProofer.check_directory("./_site", options).run
end

desc "Make a research project"
task :new_project, [:title] do |t, args|
  title_slug = args.title.downcase.gsub(' ', '-')
  fn = '_research/' + title_slug + '.md'
  titlecase_title = args.title.titlecase
  File.open(fn, 'w'){|f|
    f.puts("---")
    f.puts("collaborators: ")
    f.puts("  - name: ")
    f.puts("    slug: ")
    f.puts("    role: ")
    f.puts("current: false")
    f.puts("layout: research")
    f.puts("link: ''")
    f.puts("slug: #{title_slug}")
    f.puts("title: #{titlecase_title}")
    f.puts("research-category:")
    f.puts("  - ")
    f.puts("  - ")
    f.puts("---")
    f.puts("Description of the project goes here")
  }
  puts "New research project created at #{fn}"
end

desc "Make a new event"
task :new_event, [] do |t, args|

end

desc "Make a new person"
task :new_person, [:first_name, :last_name] do |t, args|
  slug = args.first_name + '-' + args.last_name
  fn = '_people/' + slug + '.md'
  File.open(fn, 'w'){|f|
    f.puts("---")
    f.puts("department: None")
    f.puts("email: None")
    f.puts("first_name: #{args.first_name}")
    f.puts("last_name: #{args.last_name}")
    f.puts("layout: people")
    f.puts("location: None")
    f.puts("name: #{args.first_name + ' ' + args.last_name}")
    f.puts("position: None")
    f.puts("short_bio: None")
    f.puts("slug: #{slug}")
    f.puts("status: not_current")
    f.puts("twitter: None")
    f.puts("website: None")
    f.puts("people-category:")
    f.puts("  - Example category")
    f.puts("---")
    f.puts("A flashy bio goes here")
  }
  puts "New person created at #{fn}"
end

desc "Make a new post, given a title and author"
task :new_post, [:title, :author] do |t, args|
  author_slug = args.author.downcase.gsub(' ', '-')
  title_slug = args.title.downcase.gsub(' ', '-')
  date = Date.today.to_s
  fn = '_posts/' + date + '-' + title_slug + '.md'
  current_time = Time.new.strftime("%Y-%m-%d %H:%M:%S")
  File.open(fn, 'w'){|f|
    f.puts("---")
      f.puts("author: #{author_slug}")
      f.puts("date: #{current_time}")
      f.puts("layout: post")
      f.puts("slug: #{title_slug}")
      f.puts("title: #{args.title.titlecase}")
      f.puts("categories:")
      f.puts("  - Example category")
    f.puts("---")
    f.puts("content of your post here")
  }
  puts "New post created at #{fn}"
end


desc "Create corpus for search"
file './corpus.json' => ['./', *Rake::FileList['./*.md','_posts/*.md'].exclude('./ISSUE_TEMPLATE.md', './PULL_REQUEST_TEMPLATE.md', './README.md', './index.md', './code_of_conduct.md')] do |md_file|
    unsafe_loader = ->(string) { YAML.load(string) }
    corpus = md_file.sources.grep(/\.md$/)
      .map do |path|
        file_path = './' + path
        parsed = FrontMatterParser::Parser.parse_file(file_path, loader: unsafe_loader)
        {
          id: path.pathmap('%n'),
          title: parsed.front_matter["title"],
          author: parsed.front_matter["author"],
          date: parsed.front_matter["date"],
          categories: parsed.front_matter["categories"],
          url: parsed.front_matter["slug"],
          content: parsed.content,
        }
      end
  File.open(md_file.name, 'w') do |f|
    f << JSON.generate(corpus)
  end
end

file './search_index.json' => ['./corpus.json'] do |t|
  Open3.popen2('script/build-index') do |stdin, stdout, wt|
    IO.copy_stream(t.source, stdin)
    stdin.close
    IO.copy_stream(stdout, t.name)
  end
end

task :default => [:test_travis, './corpus.json', './search_index.json']
